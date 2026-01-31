'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase/app'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Notification } from '@/types/notification.types'
import { toast } from 'react-hot-toast'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  markAsRead: (notificationId: string) => Promise<void>
  clearAll: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  loading: true,
  markAsRead: async () => {},
  clearAll: async () => {},
})

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc'),
      where('expiresAt', '>', new Date())
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[]

      setNotifications(newNotifications)
      setLoading(false)

      // Show toast for new notifications
      const previousCount = notifications.length
      if (newNotifications.length > previousCount && previousCount > 0) {
        const newItems = newNotifications.slice(0, newNotifications.length - previousCount)
        newItems.forEach(notification => {
          if (notification.status === 'sent') {
            toast(notification.message, {
              icon: '🔔',
              duration: 5000,
              position: 'top-right',
            })
          }
        })
      }
    }, (error) => {
      console.error('Error fetching notifications:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const markAsRead = async (notificationId: string) => {
    // Implement mark as read logic
    console.log('Mark as read:', notificationId)
  }

  const clearAll = async () => {
    // Implement clear all logic
    console.log('Clear all notifications')
  }

  const unreadCount = notifications.filter(n => n.status !== 'read').length

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      markAsRead,
      clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
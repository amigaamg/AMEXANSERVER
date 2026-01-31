import { useAuth as useAuthContext } from '../components/AuthProvider'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase/app'
import { UserRole } from '@/types/user.types'

export function useAuth() {
  const context = useAuthContext()

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const hasRole = (role: UserRole) => {
    return context.user?.role === role
  }

  const hasAnyRole = (roles: UserRole[]) => {
    return roles.includes(context.user?.role as UserRole)
  }

  const isPatient = () => hasRole(UserRole.PATIENT)
  const isDoctor = () => hasRole(UserRole.DOCTOR)
  const isAdmin = () => hasRole(UserRole.ADMIN)

  return {
    ...context,
    logout,
    hasRole,
    hasAnyRole,
    isPatient,
    isDoctor,
    isAdmin,
  }
}
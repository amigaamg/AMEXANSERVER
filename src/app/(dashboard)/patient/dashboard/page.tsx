'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Heart, Pill, TrendingUp, AlertCircle } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const glucoseData = [
  { time: '6 AM', value: 95 },
  { time: '9 AM', value: 120 },
  { time: '12 PM', value: 180 },
  { time: '3 PM', value: 140 },
  { time: '6 PM', value: 110 },
  { time: '9 PM', value: 100 },
]

const upcomingAppointments = [
  { id: 1, doctor: 'Dr. Sarah Smith', time: 'Today, 2:00 PM', type: 'Follow-up' },
  { id: 2, doctor: 'Dr. Michael Chen', time: 'Tomorrow, 10:00 AM', type: 'Consultation' },
  { id: 3, doctor: 'Dr. Emily Johnson', time: 'Dec 15, 3:30 PM', type: 'Check-up' },
]

const medications = [
  { id: 1, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', nextDose: 'In 2 hours' },
  { id: 2, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', nextDose: 'Tomorrow AM' },
  { id: 3, name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', nextDose: 'Tonight' },
]

export default function PatientDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, John</h1>
        <p className="text-gray-600">Here's your health overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Glucose</CardTitle>
            <TrendingUp className="h-4 w-4 text-healthcare-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128 mg/dL</div>
            <p className="text-xs text-green-600">Within normal range</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
            <Heart className="h-4 w-4 text-healthcare-rose" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125/82</div>
            <p className="text-xs text-green-600">Optimal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medication Adherence</CardTitle>
            <Pill className="h-4 w-4 text-healthcare-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-green-600">Excellent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
            <Calendar className="h-4 w-4 text-healthcare-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-gray-500">2:00 PM with Dr. Smith</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Data */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Glucose Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Glucose Trends</CardTitle>
            <CardDescription>Today's blood glucose readings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={glucoseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0d9488" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled consultations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{appointment.doctor}</p>
                    <p className="text-sm text-gray-500">{appointment.time}</p>
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                      {appointment.type}
                    </span>
                  </div>
                  <Button size="sm" variant="outline">
                    Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Medications */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Medications</CardTitle>
            <CardDescription>Today's medication schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="p-4 border rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{med.name}</h3>
                    <AlertCircle className="h-5 w-5 text-healthcare-amber" />
                  </div>
                  <p className="text-sm text-gray-600">Dosage: {med.dosage}</p>
                  <p className="text-sm text-gray-600">Frequency: {med.frequency}</p>
                  <div className="pt-2 border-t">
                    <p className="text-sm">
                      <span className="font-medium">Next dose:</span> {med.nextDose}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>Log Glucose Reading</Button>
            <Button variant="outline">Book Appointment</Button>
            <Button variant="outline">Order Supplies</Button>
            <Button variant="outline">Chat with Doctor</Button>
            <Button variant="outline">View Insurance Claims</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
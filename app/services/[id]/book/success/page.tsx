"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const appointmentId = searchParams ? searchParams.get("appointmentId") : null
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="border-t-4 border-t-green-500">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-700">Booking Confirmed!</CardTitle>
            <p className="text-gray-600 mt-2">
              Your appointment has been successfully booked. A confirmation has been sent to your email.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-t pt-4">
              <p className="font-medium mb-2">Reference Number</p>
              <p className="bg-blue-50 text-govdocs-blue font-mono text-center py-2 rounded">{appointmentId || "Booking ID"}</p>
              <p className="text-sm text-gray-500 mt-2">
                Please keep this reference number for your records. You'll need it if you want to modify or cancel your appointment.
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-800">
              <p className="font-medium">Important:</p>
              <p>Please arrive 15 minutes before your scheduled time and bring all required documents.</p>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Link href="/services">
                <Button variant="outline">Back to Services</Button>
              </Link>
              <Button className="bg-govdocs-blue hover:bg-blue-700">
                View My Appointments
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
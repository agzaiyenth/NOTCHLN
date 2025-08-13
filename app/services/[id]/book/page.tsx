"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const timeSlots = [
  { time: "9:00 AM", available: true },
  { time: "9:30 AM", available: false },
  { time: "10:00 AM", available: true },
  { time: "10:30 AM", available: true },
  { time: "11:00 AM", available: false },
  { time: "11:30 AM", available: true },
  { time: "2:00 PM", available: true },
  { time: "2:30 PM", available: true },
  { time: "3:00 PM", available: false },
  { time: "3:30 PM", available: true },
  { time: "4:00 PM", available: true },
  { time: "4:30 PM", available: true },
]

const officers = [
  { name: "Grama Niladhari", location: "Local Office", available: true },
  { name: "Principal", location: "School Office", available: true },
  { name: "Estate Superintendent", location: "Estate Office", available: false },
  { name: "Justice of Peace", location: "Court Office", available: true },
]

const locations = [
  { name: "Battaramulla Head Office", address: "123 Main Street, Battaramulla", distance: "2.5 km" },
  { name: "Colombo District Office", address: "456 Galle Road, Colombo 03", distance: "5.2 km" },
  { name: "Nugegoda Branch", address: "789 High Level Road, Nugegoda", distance: "3.8 km" },
]

export default function BookingPage({ params }: { params: { id: string } }) {
  const [selectedDate, setSelectedDate] = useState<string>("2025-01-15")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedOfficer, setSelectedOfficer] = useState<string>("")
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [step, setStep] = useState<number>(1)
  const router = useRouter()

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      router.push("/payment")
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedDate
      case 2:
        return selectedTime
      case 3:
        return selectedOfficer
      case 4:
        return selectedLocation
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/services" className="text-govdocs-blue hover:text-blue-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
              <p className="text-gray-600">NIC & Passport Services</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: "Select Date", icon: Calendar },
              { step: 2, title: "Choose Time", icon: Clock },
              { step: 3, title: "Select Officer", icon: User },
              { step: 4, title: "Pick Location", icon: MapPin },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center gap-3 ${index < 3 ? "mr-4" : ""}`}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= item.step ? "bg-govdocs-blue text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > item.step ? <CheckCircle className="w-5 h-5" /> : <item.icon className="w-5 h-5" />}
                  </div>
                  <div className="hidden sm:block">
                    <div className={`text-sm font-medium ${step >= item.step ? "text-govdocs-blue" : "text-gray-500"}`}>
                      {item.title}
                    </div>
                  </div>
                </div>
                {index < 3 && (
                  <div
                    className={`hidden sm:block w-16 h-0.5 ${step > item.step ? "bg-govdocs-blue" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {step === 1 && "Select Date"}
                  {step === 2 && "Choose Time Slot"}
                  {step === 3 && "Select Certifying Officer"}
                  {step === 4 && "Pick Location"}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Choose your preferred appointment date"}
                  {step === 2 && "Select an available time slot"}
                  {step === 3 && "Choose who will attest your form"}
                  {step === 4 && "Select the office location"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Date Selection */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(`2025-01-${date.toString().padStart(2, "0")}`)}
                          className={`p-2 text-sm rounded-lg transition-colors ${
                            selectedDate === `2025-01-${date.toString().padStart(2, "0")}`
                              ? "bg-govdocs-blue text-white"
                              : "hover:bg-gray-100"
                          } ${date < 10 ? "text-gray-400" : ""}`}
                          disabled={date < 10}
                        >
                          {date}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Time Selection */}
                {step === 2 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 text-sm rounded-lg border transition-colors ${
                          selectedTime === slot.time
                            ? "bg-govdocs-blue text-white border-govdocs-blue"
                            : slot.available
                              ? "border-gray-200 hover:border-govdocs-blue hover:bg-blue-50"
                              : "border-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {slot.time}
                        {!slot.available && <div className="text-xs mt-1">Booked</div>}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 3: Officer Selection */}
                {step === 3 && (
                  <div className="space-y-3">
                    {officers.map((officer) => (
                      <button
                        key={officer.name}
                        onClick={() => officer.available && setSelectedOfficer(officer.name)}
                        disabled={!officer.available}
                        className={`w-full p-4 text-left rounded-lg border transition-colors ${
                          selectedOfficer === officer.name
                            ? "bg-govdocs-blue text-white border-govdocs-blue"
                            : officer.available
                              ? "border-gray-200 hover:border-govdocs-blue hover:bg-blue-50"
                              : "border-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <div className="font-medium">{officer.name}</div>
                        <div className="text-sm opacity-75">{officer.location}</div>
                        {!officer.available && (
                          <Badge variant="secondary" className="mt-2">
                            Unavailable
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step 4: Location Selection */}
                {step === 4 && (
                  <div className="space-y-3">
                    {locations.map((location) => (
                      <button
                        key={location.name}
                        onClick={() => setSelectedLocation(location.name)}
                        className={`w-full p-4 text-left rounded-lg border transition-colors ${
                          selectedLocation === location.name
                            ? "bg-govdocs-blue text-white border-govdocs-blue"
                            : "border-gray-200 hover:border-govdocs-blue hover:bg-blue-50"
                        }`}
                      >
                        <div className="font-medium">{location.name}</div>
                        <div className="text-sm opacity-75">{location.address}</div>
                        <div className="text-sm opacity-75 mt-1">{location.distance} away</div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={handleBack} disabled={step === 1} className="bg-transparent">
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={!canProceed()} className="bg-govdocs-blue hover:bg-blue-700">
                    {step === 4 ? "Proceed to Payment" : "Next"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium">NIC Replacement</span>
                  </div>

                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                  {selectedTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                  )}

                  {selectedOfficer && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Officer</span>
                      <span className="font-medium">{selectedOfficer}</span>
                    </div>
                  )}

                  {selectedLocation && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium">{selectedLocation}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Fee</span>
                    <span className="text-govdocs-blue">PKR 2,500</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <strong>Note:</strong> You will be redirected to secure payment processing after confirming your
                  booking details.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

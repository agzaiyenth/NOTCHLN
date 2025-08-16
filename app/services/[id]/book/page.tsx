"use client"

import React from 'react'
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import Cal, { getCalApi } from "@calcom/embed-react"

export default function BookingPage({ params }: { params: { id: string } }) {
  // Use params directly as it is already typed
  const serviceId = params.id;
  
  const [selectedDate, setSelectedDate] = useState<string>("2025-01-15")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedOfficer, setSelectedOfficer] = useState<string>("")
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [step, setStep] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [calLoaded, setCalLoaded] = useState(false)
  const router = useRouter()

  // Initialize Cal.com API and listen for booking success event
  useEffect(() => {
    (async function () {
      try {
        await getCalApi();
        setCalLoaded(true);

        // Listen for Cal.com booking success event
        window.addEventListener("cal.com:bookingSuccessful", (e: any) => {
          toast({
            title: "Booking Successful",
            description: "Your appointment has been confirmed.",
          });
          router.push(`/services/${serviceId}/book/success?appointmentId=${e.detail.bookingId}`);
        });
      } catch (error) {
        console.error("Failed to load Cal API:", error);
        toast({
          title: "Error",
          description: "Failed to load booking system",
          variant: "destructive"
        });
      }
    })();

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("cal.com:bookingSuccessful", () => {});
    };
  }, []);

  // Get service name based on ID (example mapping)
  const getServiceName = (id: string) => {
    const services: Record<string, string> = {
      "nic": "NIC Replacement",
      "passport": "Passport Application",
      "driving": "Driving License Renewal",
      "birth": "Birth Certificate"
    };
    return services[id] || "NIC & Passport Services";
  };

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
              <p className="text-gray-600">{getServiceName(serviceId)}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cal.com Embed */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Your Appointment</CardTitle>
                <CardDescription>
                  Book a time for your {getServiceName(serviceId)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="cal-embed-container" style={{ minHeight: "600px" }}>
                  <Cal
                    calLink={process.env.NEXT_PUBLIC_CAL_LINK || "rama-raguram-xf1xgq/govdoc"}
                    style={{ width: "100%", height: "100%", overflow: "scroll" }}
                    config={{
                      name: "User",
                      email: "user@example.com",
                      theme: "light",
                      hideEventTypeDetails: "false",
                      layout: "month_view",
                      metadata: {
                        serviceId: serviceId,
                        namespace: process.env.NEXT_PUBLIC_CAL_NAMESPACE || "govdocs",
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Service Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium">{getServiceName(serviceId)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Fee</span>
                    <span className="font-medium text-govdocs-blue">Lkr 2,500</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-sm text-gray-600">
                    <p className="mb-2"><strong>Required Documents:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Valid identification</li>
                      <li>Proof of address</li>
                      <li>Recent passport-size photographs</li>
                      <li>Previous {getServiceName(serviceId)} (if applicable)</li>
                    </ul>
                  </div>
                </div>

                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <strong>Note:</strong> You will be redirected to secure payment processing after confirming your booking details.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

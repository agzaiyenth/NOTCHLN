"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function OfficerPendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-govdocs-blue rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-govdocs-blue">GovDocs Officer</span>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <CardTitle className="text-xl">Account Pending Approval</CardTitle>
            <CardDescription>Your officer account is being reviewed by administrators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Account created successfully</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-gray-700">Pending administrator approval</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-50">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">Access to officer portal</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>What happens next?</strong>
                <br />
                Our administrators will verify your credentials and department information. You'll receive an email
                notification once your account is approved.
              </p>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/officer/login">Back to Login</Link>
              </Button>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

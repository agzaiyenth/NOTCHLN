"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Smartphone, Building2, CheckCircle, ArrowLeft, Shield, Clock } from "lucide-react"
import Link from "next/link"

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsProcessing(false)
    setIsComplete(true)
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="text-center">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
              <p className="text-gray-600 mb-8">
                Your payment has been processed successfully. You will receive a confirmation email shortly.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Transaction ID</span>
                  <span className="font-mono text-sm">TXN-2025-001234</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Amount Paid</span>
                  <span className="font-semibold">Lkr 2,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Service</span>
                  <span className="text-sm">NIC Replacement</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
          <p className="text-gray-600 mt-2">Secure payment processing for your government service</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-govdocs-blue" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">Select Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="mobile" id="mobile" />
                      <Smartphone className="w-5 h-5 text-gray-600" />
                      <Label htmlFor="mobile" className="flex-1 cursor-pointer">
                        <div className="font-medium">Mobile Payment</div>
                        <div className="text-sm text-gray-500">EzCash, Solo Pay, Koko Payment</div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="bank" id="bank" />
                      <Building2 className="w-5 h-5 text-gray-600" />
                      <Label htmlFor="bank" className="flex-1 cursor-pointer">
                        <div className="font-medium">Bank Transfer</div>
                        <div className="text-sm text-gray-500">Direct bank account transfer</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Payment Form Fields */}
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input id="cardName" placeholder="John Doe" />
                    </div>
                  </div>
                )}

                {paymentMethod === "mobile" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="mobileNumber">Mobile Number</Label>
                      <Input id="mobileNumber" placeholder="+92 300 1234567" />
                    </div>
                    <div>
                      <Label htmlFor="mobilePin">Mobile PIN</Label>
                      <Input id="mobilePin" type="password" placeholder="Enter your mobile wallet PIN" />
                    </div>
                  </div>
                )}

                {paymentMethod === "bank" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input id="accountNumber" placeholder="1234567890123456" />
                    </div>
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input id="bankName" placeholder="Select your bank" />
                    </div>
                  </div>
                )}

                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-govdocs-blue mt-0.5" />
                    <div>
                      <h4 className="font-medium text-govdocs-blue mb-1">Secure Payment</h4>
                      <p className="text-sm text-blue-700">
                        Your payment information is encrypted and secure. We never store your payment details.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-govdocs-blue hover:bg-blue-700"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    `Pay Lkr 2,500`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service</span>
                    <span className="font-medium">NIC Replacement</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Application ID</span>
                    <span className="font-mono text-sm">APP-2025-001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Fee</span>
                    <span>Lkr 2,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Charges</span>
                    <span>Lkr 500</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span className="text-govdocs-blue">Lkr 2,500</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-sm">Appointment Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Date: January 25, 2025</div>
                    <div>Time: 10:00 AM</div>
                    <div>Officer: Sarah Ahmed</div>
                    <div>Location: NADRA Office, Islamabad</div>
                  </div>
                </div>

                <Badge variant="secondary" className="w-full justify-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Payment due in 24 hours
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, Star, Users, CheckCircle, ArrowLeft, MessageCircle } from "lucide-react"
import Link from "next/link"

const serviceDetails = {
  "nic-passport": {
    title: "NIC & Passport Services",
    description: "Complete identity document services including new applications, renewals, and replacements",
    icon: FileText,
    category: "Identity Documents",
    duration: "30 mins",
    fee: "Rs. 1,000",
    rating: 4.8,
    reviews: 1247,
    services: [
      { name: "New NIC Application", fee: "Rs. 500", duration: "30 mins" },
      { name: "NIC Replacement", fee: "Rs. 1,000", duration: "30 mins" },
      { name: "Passport Renewal", fee: "Rs. 3,500", duration: "45 mins" },
      { name: "New Passport Application", fee: "Rs. 5,000", duration: "60 mins" },
    ],
    requirements: [
      "Birth Certificate (Original + Copy)",
      "Recent Passport Size Photos (2)",
      "Police Report (if lost)",
      "Previous NIC/Passport (if available)",
      "Proof of Address",
    ],
    process: [
      "Submit required documents",
      "Verification by authorized officer",
      "Biometric data collection",
      "Payment processing",
      "Document issuance",
    ],
    faqs: [
      {
        question: "How long does it take to get a replacement NIC?",
        answer: "Typically 7-10 working days after your appointment and document verification.",
      },
      {
        question: "What if I don't have a police report?",
        answer:
          "You can file a police report at your nearest police station. Our AI assistant can guide you through this process.",
      },
      {
        question: "Can I track my application status?",
        answer: "Yes, you'll receive an application ID to track your progress through our dashboard.",
      },
    ],
  },
}

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const service = serviceDetails[params.id as keyof typeof serviceDetails]

  if (!service) {
    return <div>Service not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/services" className="text-govdocs-blue hover:text-blue-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <service.icon className="w-6 h-6 text-govdocs-blue" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{service.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <Badge variant="secondary">{service.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {service.rating} ({service.reviews} reviews)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Service Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Service Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="w-6 h-6 text-govdocs-blue mx-auto mb-2" />
                    <div className="font-medium">{service.duration}</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="w-6 h-6 text-govdocs-blue mx-auto mb-2" />
                    <div className="font-medium">{service.reviews}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Star className="w-6 h-6 text-govdocs-blue mx-auto mb-2" />
                    <div className="font-medium">{service.rating}/5</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Services */}
            <Card>
              <CardHeader>
                <CardTitle>Available Services</CardTitle>
                <CardDescription>Choose the specific service you need</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {service.services.map((subService, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-medium">{subService.name}</div>
                        <div className="text-sm text-gray-600">Duration: {subService.duration}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-govdocs-blue">{subService.fee}</div>
                        <Button size="sm" className="mt-2 bg-govdocs-blue hover:bg-blue-700" asChild>
                          <Link href={`/services/${params.id}/book`}>Book</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Required Documents</CardTitle>
                <CardDescription>Make sure you have these documents ready</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {service.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>{requirement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Process */}
            <Card>
              <CardHeader>
                <CardTitle>Application Process</CardTitle>
                <CardDescription>Step-by-step process overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {service.process.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-govdocs-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="font-medium">{step}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQs */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {service.faqs.map((faq, index) => (
                    <div key={index}>
                      <div className="font-medium text-gray-900 mb-2">{faq.question}</div>
                      <div className="text-gray-600 leading-relaxed">{faq.answer}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Quick Book */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button size="lg" className="w-full bg-govdocs-blue hover:bg-blue-700" asChild>
                    <Link href={`/services/${params.id}/book`}>Book Appointment</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/chat">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat with AI
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-govdocs-blue">{service.fee}</div>
                    <div className="text-sm text-gray-600 mt-1">Starting from</div>
                    <div className="text-xs text-gray-500 mt-2">Final fee depends on specific service selected</div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-600">Our support team is available 24/7 to assist you.</div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, Users, Shield, Building, Heart, Car, Search, Clock, Star, ArrowLeft } from "lucide-react"
import Link from "next/link"

const services = [
  {
    id: "nic-passport",
    title: "NIC & Passport",
    description: "Replace lost documents, renew expired ones, apply for new documents",
    icon: FileText,
    category: "Identity Documents",
    duration: "30 mins",
    fee: "Rs. 1,000",
    rating: 4.8,
    popular: true,
    services: ["New NIC", "NIC Replacement", "Passport Renewal", "New Passport"],
  },
  {
    id: "birth-registration",
    title: "Birth Registration",
    description: "Register births and obtain birth certificates",
    icon: Users,
    category: "Civil Registration",
    duration: "20 mins",
    fee: "Rs. 500",
    rating: 4.9,
    popular: true,
    services: ["Birth Certificate", "Late Registration", "Correction of Details"],
  },
  {
    id: "driving-license",
    title: "Driving License",
    description: "Apply, renew, and update driving licenses",
    icon: Car,
    category: "Transport",
    duration: "45 mins",
    fee: "Rs. 2,500",
    rating: 4.7,
    popular: true,
    services: ["New License", "License Renewal", "International Permit", "Duplicate License"],
  },
  {
    id: "death-registration",
    title: "Death Registration",
    description: "Register deaths and obtain death certificates",
    icon: FileText,
    category: "Civil Registration",
    duration: "25 mins",
    fee: "Rs. 300",
    rating: 4.6,
    popular: false,
    services: ["Death Certificate", "Burial Permit", "Cremation Permit"],
  },
  {
    id: "marriage-registration",
    title: "Marriage Registration",
    description: "Register marriages and obtain marriage certificates",
    icon: Heart,
    category: "Civil Registration",
    duration: "35 mins",
    fee: "Rs. 750",
    rating: 4.8,
    popular: false,
    services: ["Marriage Certificate", "Marriage Registration", "Certificate Copy"],
  },
  {
    id: "business-registration",
    title: "Business Registration",
    description: "Start and register your business with government",
    icon: Building,
    category: "Business",
    duration: "60 mins",
    fee: "Rs. 5,000",
    rating: 4.5,
    popular: false,
    services: ["Company Registration", "Business License", "Tax Registration", "Trade Name"],
  },
  {
    id: "vehicle-registration",
    title: "Vehicle Registration",
    description: "Register vehicles and obtain registration documents",
    icon: Shield,
    category: "Transport",
    duration: "40 mins",
    fee: "Rs. 3,000",
    rating: 4.4,
    popular: false,
    services: ["New Registration", "Transfer of Ownership", "Duplicate Registration"],
  },
  {
    id: "tax-registration",
    title: "Tax Registration",
    description: "Register for various tax services and obtain certificates",
    icon: FileText,
    category: "Business",
    duration: "50 mins",
    fee: "Rs. 1,500",
    rating: 4.3,
    popular: false,
    services: ["VAT Registration", "Income Tax", "Withholding Tax", "Tax Clearance"],
  },
]

const categories = ["All", "Identity Documents", "Civil Registration", "Transport", "Business"]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-govdocs-blue hover:text-blue-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Government Services</h1>
              <p className="text-gray-600">Choose a service and book your appointment</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search services..." className="pl-10 h-11" />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  size="sm"
                  className={category === "All" ? "bg-govdocs-blue hover:bg-blue-700" : "bg-transparent"}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Services Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow group cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-govdocs-blue group-hover:text-white transition-colors">
                      <service.icon className="w-6 h-6 text-govdocs-blue group-hover:text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {service.category}
                      </Badge>
                    </div>
                  </div>
                  {service.popular && (
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Popular</Badge>
                  )}
                </div>
                <CardDescription className="text-sm leading-relaxed">{service.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {service.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {service.rating}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-900">Available Services:</div>
                  <div className="flex flex-wrap gap-1">
                    {service.services.slice(0, 3).map((subService, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-transparent">
                        {subService}
                      </Badge>
                    ))}
                    {service.services.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-transparent">
                        +{service.services.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-lg font-bold text-govdocs-blue">{service.fee}</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="bg-transparent" asChild>
                      <Link href={`/services/${service.id}`}>Details</Link>
                    </Button>
                    <Button size="sm" className="bg-govdocs-blue hover:bg-blue-700" asChild>
                      <Link href={`/services/${service.id}/book`}>Book Now</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Need Help Choosing?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Not sure which service you need? Our AI assistant can guide you through the process and help you find the
              right service.
            </p>
            <Button size="lg" className="bg-govdocs-blue hover:bg-blue-700" asChild>
              <Link href="/chat">Chat with AI Assistant</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

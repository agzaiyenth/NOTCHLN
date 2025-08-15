'use client'

import { FileText, Users, Shield, ArrowRight, CheckCircle, Star, MessageSquare, Clock, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { monitorAuthState, getIdToken } from "@/lib/authServices"

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleUserLoggedIn = async (user: any) => {
      setIsLoggedIn(true)
      try {
        const token = await getIdToken()
        console.log("Token:", token) // Use this token for secure API requests

        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setFirstName(userDoc.data().firstName || "User")
        } else {
          console.warn("User document does not exist in Firestore.")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
      setIsLoading(false)
    }

    const handleUserLoggedOut = () => {
      setIsLoggedIn(false)
      setFirstName("")
      setIsLoading(false)
    }

    monitorAuthState(handleUserLoggedIn, handleUserLoggedOut)
  }, [])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-govdocs-blue rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">GovDocs</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-600 hover:text-govdocs-blue transition-colors">
                Services
              </a>
              <a href="#about" className="text-gray-600 hover:text-govdocs-blue transition-colors">
                About
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-govdocs-blue transition-colors">
                How It Works
              </a>
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-900 text-bold">Hey, {firstName}! 👋</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-gray-600 hover:text-blue-700"
                    onClick={() => {
                      setIsLoggedIn(false)
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="outline" size="sm">
                    <a href="/login">Sign In</a>
                  </Button>
                  <Button size="sm" className="bg-govdocs-blue hover:bg-blue-700">
                    <a href="/signup">Get Started</a>
                  </Button>
                </>
              )}
            </div>
            <div className="md:hidden">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">Hey, {firstName}!</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsLoggedIn(false)
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-govdocs-blue hover:bg-blue-100">
                  🚀 AI-Powered Government Services
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Government Documents
                  <span className="text-govdocs-blue block">Made Simple</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Skip the queues, avoid the paperwork hassle. Our AI assistant guides you through every government
                  process in minutes, not hours.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-govdocs-blue hover:bg-blue-700 text-lg px-8" asChild>
                  <Link href="/chat">
                    Start with AI Assistant
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
                  <Link href="/services">Browse Services</Link>
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-white"
                      ></div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">50,000+ citizens served</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">4.9/5 rating</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-govdocs-blue rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">GovDocs AI Assistant</p>
                      <p className="text-sm text-gray-500">Online now</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-gray-700">Hi! I need to renew my NIC card. Can you help?</p>
                    </div>
                    <div className="bg-govdocs-blue rounded-lg p-3 max-w-xs ml-auto text-white">
                      <p className="text-sm">
                        I'll guide you through the NIC renewal process. First, let me check what documents you'll
                        need...
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs">AI is typing...</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
              <div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your government documents processed in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                icon: MessageSquare,
                title: "Chat with AI",
                desc: "Tell our AI what document you need. It understands your requirements instantly.",
              },
              {
                step: "2",
                icon: FileText,
                title: "Upload Documents",
                desc: "Upload required documents. Our AI verifies them automatically using OCR.",
              },
              {
                step: "3",
                icon: Clock,
                title: "Book Appointment",
                desc: "Choose your preferred time and location. Skip the long queues.",
              },
              {
                step: "4",
                icon: CheckCircle,
                title: "Get Your Documents",
                desc: "Receive your processed documents. Track progress in real-time.",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-govdocs-blue rounded-full flex items-center justify-center mx-auto">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-govdocs-blue">{step.step}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-gray-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive government document services powered by AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "NIC & Passport",
                desc: "Replace lost documents, renew expired ones",
                id: "nic-passport",
                popular: true,
              },
              {
                icon: Users,
                title: "Birth Registration",
                desc: "Register births and get certificates",
                id: "birth-registration",
              },
              {
                icon: Shield,
                title: "Driving License",
                desc: "Apply, renew, and update licenses",
                id: "driving-license",
              },
              {
                icon: FileText,
                title: "Death Registration",
                desc: "Register deaths and obtain certificates",
                id: "death-registration",
              },
              {
                icon: Users,
                title: "Marriage Registration",
                desc: "Register marriages and get certificates",
                id: "marriage-registration",
              },
              {
                icon: FileText,
                title: "Business Registration",
                desc: "Start and register your business",
                id: "business-registration",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-white/80 backdrop-blur-sm hover:bg-white relative overflow-hidden"
                asChild
              >
                <Link href={`/services/${service.id}`}>
                  <CardContent className="p-6">
                    {service.popular && (
                      <Badge className="absolute top-4 right-4 bg-green-100 text-green-700 hover:bg-green-100">
                        Popular
                      </Badge>
                    )}
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-govdocs-blue transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-600">{service.desc}</p>
                      </div>
                      <div className="flex items-center text-govdocs-blue opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm font-medium">Learn more</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-govdocs-blue hover:bg-blue-700 text-lg px-8" asChild>
              <Link href="/services">
                View All Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Revolutionizing Government Services</h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  We're on a mission to make government services accessible, efficient, and user-friendly for every
                  citizen.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: Zap,
                    title: "AI-Powered Efficiency",
                    desc: "Our advanced AI understands your needs and guides you through complex processes in simple steps.",
                  },
                  {
                    icon: Shield,
                    title: "Secure & Reliable",
                    desc: "Bank-level security ensures your personal information and documents are always protected.",
                  },
                  {
                    icon: Clock,
                    title: "Save Time & Money",
                    desc: "No more long queues or multiple visits. Complete most processes from the comfort of your home.",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-govdocs-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-govdocs-blue hover:bg-blue-700" asChild>
                  <Link href="/chat">Try AI Assistant</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-2xl font-bold text-govdocs-blue mb-2">50K+</div>
                    <div className="text-sm text-gray-600">Citizens Served</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-2xl font-bold text-govdocs-blue mb-2">98%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-2xl font-bold text-govdocs-blue mb-2">24/7</div>
                    <div className="text-sm text-gray-600">AI Support</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-2xl font-bold text-govdocs-blue mb-2">15min</div>
                    <div className="text-sm text-gray-600">Avg. Process Time</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 animate-pulse"></div>
              <div
                className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-10 animate-pulse"
                style={{ animationDelay: "1.5s" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-govdocs-blue to-blue-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Ready to Simplify Your Government Processes?</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of citizens who have already transformed their government document experience with our AI
              assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-govdocs-blue hover:bg-gray-100 text-lg px-8">
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-govdocs-blue text-lg px-8 bg-transparent"
              >
                <Link href="/chat">Try AI Assistant</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-govdocs-blue rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">GovDocs</span>
              </div>
              <p className="text-gray-400">Making government services simple, fast, and accessible for everyone.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/services/nic-passport" className="hover:text-white transition-colors">
                    NIC & Passport
                  </Link>
                </li>
                <li>
                  <Link href="/services/birth-registration" className="hover:text-white transition-colors">
                    Birth Registration
                  </Link>
                </li>
                <li>
                  <Link href="/services/driving-license" className="hover:text-white transition-colors">
                    Driving License
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/chat" className="hover:text-white transition-colors">
                    AI Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 GovDocs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

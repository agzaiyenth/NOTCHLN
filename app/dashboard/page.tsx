"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Bell,
  CreditCard,
  MessageCircle,
  Download,
  Eye,
  Plus,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

interface Application {
  id: string
  service: string
  type: string
  status: "submitted" | "processing" | "ready" | "completed"
  progress: number
  submittedDate: string
  expectedDate: string
  appointmentDate?: string
  location?: string
  fee: string
  documents: {
    name: string
    status: "verified" | "pending" | "rejected"
  }[]
}

const applications: Application[] = [
  {
    id: "NIC2025001",
    service: "NIC Replacement",
    type: "Identity Document",
    status: "processing",
    progress: 60,
    submittedDate: "2025-01-10",
    expectedDate: "2025-01-20",
    appointmentDate: "2025-01-15",
    location: "Battaramulla Head Office",
    fee: "Rs. 1,000",
    documents: [
      { name: "Police Report", status: "verified" },
      { name: "Birth Certificate", status: "verified" },
      { name: "Passport Photo", status: "verified" },
    ],
  },
  {
    id: "PP2025002",
    service: "Passport Renewal",
    type: "Identity Document",
    status: "ready",
    progress: 90,
    submittedDate: "2025-01-05",
    expectedDate: "2025-01-18",
    appointmentDate: "2025-01-12",
    location: "Colombo Passport Office",
    fee: "Rs. 3,500",
    documents: [
      { name: "Old Passport", status: "verified" },
      { name: "Application Form", status: "verified" },
      { name: "Passport Photos", status: "verified" },
    ],
  },
  {
    id: "BC2025003",
    service: "Birth Certificate",
    type: "Civil Registration",
    status: "submitted",
    progress: 25,
    submittedDate: "2025-01-12",
    expectedDate: "2025-01-25",
    fee: "Rs. 500",
    documents: [
      { name: "Hospital Records", status: "pending" },
      { name: "Parent ID Copies", status: "verified" },
    ],
  },
]

const notifications = [
  {
    id: "1",
    type: "success",
    title: "Document Ready for Collection",
    message: "Your passport renewal is ready for collection at Colombo Passport Office",
    time: "2 hours ago",
    applicationId: "PP2025002",
  },
  {
    id: "2",
    type: "info",
    title: "Appointment Reminder",
    message: "Your NIC replacement appointment is tomorrow at 10:00 AM",
    time: "1 day ago",
    applicationId: "NIC2025001",
  },
  {
    id: "3",
    type: "warning",
    title: "Document Verification Pending",
    message: "Please submit hospital records for your birth certificate application",
    time: "3 days ago",
    applicationId: "BC2025003",
  },
]

const recentActivity = [
  { action: "Document uploaded", service: "NIC Replacement", time: "2 hours ago" },
  { action: "Payment completed", service: "Passport Renewal", time: "1 day ago" },
  { action: "Application submitted", service: "Birth Certificate", time: "3 days ago" },
  { action: "Appointment booked", service: "NIC Replacement", time: "1 week ago" },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-700"
      case "processing":
        return "bg-yellow-100 text-yellow-700"
      case "ready":
        return "bg-green-100 text-green-700"
      case "completed":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: Application["status"]) => {
    switch (status) {
      case "submitted":
        return <Clock className="w-4 h-4" />
      case "processing":
        return <AlertCircle className="w-4 h-4" />
      case "ready":
        return <CheckCircle className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "info":
        return <Bell className="w-5 h-5 text-blue-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <img src="/logo.png" alt="GovDocs Logo" className="w-20 h-20" />
                </div>
              </div>
            </Link>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-5 h-5" />
              </Button>
              <Button size="sm" className="bg-govdocs-blue hover:bg-blue-700" asChild>
                <Link href="/chat">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with AI
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Harsha!</h2>
          <p className="text-gray-600">Here's what's happening with your applications</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <FileText className="w-8 h-8 text-govdocs-blue" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">2</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ready to Collect</p>
                  <p className="text-2xl font-bold text-green-600">1</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-govdocs-blue">Rs. 5,000</p>
                </div>
                <CreditCard className="w-8 h-8 text-govdocs-blue" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Applications */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Applications</CardTitle>
                      <CardDescription>Track your latest document requests</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent" asChild>
                      <Link href="/services">
                        <Plus className="w-4 h-4 mr-2" />
                        New Application
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {applications.slice(0, 3).map((app) => (
                        <div key={app.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-medium text-gray-900">{app.service}</h3>
                              <p className="text-sm text-gray-600">Application ID: {app.id}</p>
                            </div>
                            <Badge className={getStatusColor(app.status)}>
                              {getStatusIcon(app.status)}
                              <span className="ml-1 capitalize">{app.status}</span>
                            </Badge>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{app.progress}%</span>
                            </div>
                            <Progress value={app.progress} className="h-2" />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              Expected: {new Date(app.expectedDate).toLocaleDateString()}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="bg-transparent">
                                <Eye className="w-4 h-4" />
                              </Button>
                              {app.status === "ready" && (
                                <Button size="sm" className="bg-govdocs-blue hover:bg-blue-700">
                                  <Download className="w-4 h-4 mr-2" />
                                  Collect
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notifications.slice(0, 3).map((notification) => (
                        <div key={notification.id} className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                      View All Notifications
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <Link href="/services">
                        <Plus className="w-4 h-4 mr-2" />
                        New Application
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <Link href="/upload">
                        <FileText className="w-4 h-4 mr-2" />
                        Upload Documents
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                      <Link href="/chat">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat with AI
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Applications</CardTitle>
                <CardDescription>Complete list of your document applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {applications.map((app) => (
                    <div key={app.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{app.service}</h3>
                          <p className="text-sm text-gray-600">
                            {app.type} • Application ID: {app.id}
                          </p>
                        </div>
                        <Badge className={getStatusColor(app.status)}>
                          {getStatusIcon(app.status)}
                          <span className="ml-1 capitalize">{app.status}</span>
                        </Badge>
                      </div>

                      {/* Progress Steps */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Application Progress</span>
                          <span className="text-sm text-gray-500">{app.progress}% Complete</span>
                        </div>
                        <Progress value={app.progress} className="h-2 mb-4" />

                        <div className="grid grid-cols-4 gap-4 text-center">
                          {[
                            { step: 1, title: "Submitted", status: app.progress >= 25 },
                            { step: 2, title: "Processing", status: app.progress >= 50 },
                            { step: 3, title: "Ready", status: app.progress >= 75 },
                            { step: 4, title: "Completed", status: app.progress >= 100 },
                          ].map((step) => (
                            <div key={step.step} className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                  step.status ? "bg-govdocs-blue text-white" : "bg-gray-200 text-gray-500"
                                }`}
                              >
                                {step.status ? <CheckCircle className="w-4 h-4" /> : step.step}
                              </div>
                              <span className={`text-xs mt-1 ${step.status ? "text-govdocs-blue" : "text-gray-500"}`}>
                                {step.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Application Details */}
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Submitted Date:</span>
                            <span className="text-sm font-medium">
                              {new Date(app.submittedDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Expected Date:</span>
                            <span className="text-sm font-medium">
                              {new Date(app.expectedDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Fee:</span>
                            <span className="text-sm font-medium text-govdocs-blue">{app.fee}</span>
                          </div>
                        </div>

                        {app.appointmentDate && (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Appointment:</span>
                              <span className="text-sm font-medium">
                                {new Date(app.appointmentDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Location:</span>
                              <span className="text-sm font-medium">{app.location}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Documents */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Documents:</h4>
                        <div className="flex flex-wrap gap-2">
                          {app.documents.map((doc, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className={`bg-transparent ${
                                doc.status === "verified"
                                  ? "border-green-500 text-green-700"
                                  : doc.status === "rejected"
                                    ? "border-red-500 text-red-700"
                                    : "border-yellow-500 text-yellow-700"
                              }`}
                            >
                              {doc.status === "verified" && <CheckCircle className="w-3 h-3 mr-1" />}
                              {doc.status === "rejected" && <AlertCircle className="w-3 h-3 mr-1" />}
                              {doc.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                              {doc.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button size="sm" variant="outline" className="bg-transparent">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {app.status === "ready" && (
                          <Button size="sm" className="bg-govdocs-blue hover:bg-blue-700">
                            <Download className="w-4 h-4 mr-2" />
                            Collect Document
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="bg-transparent" asChild>
                          <Link href="/chat">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Get Help
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Notifications</CardTitle>
                <CardDescription>Stay updated on your application progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{notification.time}</span>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">First Name</label>
                        <p className="mt-1 text-sm text-gray-900">Harsha</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Last Name</label>
                        <p className="mt-1 text-sm text-gray-900">Kavinda</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">kavinda135@gmail.com</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <p className="mt-1 text-sm text-gray-900">(94) 75 445 5445</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Address</label>
                        <p className="mt-1 text-sm text-gray-900">23/4, Colombo Rd, Colombo</p>
                      </div>
                    </div>
                    <Button className="bg-govdocs-blue hover:bg-blue-700">Edit Profile</Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <p className="text-gray-600">{activity.service}</p>
                          <p className="text-gray-500 text-xs">{activity.time}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

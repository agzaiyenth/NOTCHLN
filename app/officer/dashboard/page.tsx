"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Calendar, FileText, Clock, CheckCircle, Search, Filter, LogOut, Bell, Settings } from "lucide-react"
import Link from "next/link"

interface Application {
  id: string
  citizenName: string
  citizenEmail: string
  serviceType: string
  status: "submitted" | "under_review" | "approved" | "rejected" | "completed"
  submittedAt: Date
  appointmentDate?: Date
  appointmentTime?: string
  documents: Array<{
    name: string
    status: "pending" | "verified" | "rejected"
    uploadedAt: Date
  }>
  priority: "low" | "medium" | "high"
  department: string
}

export default function OfficerDashboard() {
  const router = useRouter()
  const [officerData, setOfficerData] = useState<any>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingReview: 0,
    todayAppointments: 0,
    completedToday: 0,
  })

  const logout = () => {
    localStorage.removeItem("officerAuth")
    router.push("/officer/login")
  }

  useEffect(() => {
    const authData = localStorage.getItem("officerAuth")
    if (!authData) {
      router.push("/officer/login")
      return
    }

    try {
      const parsedAuth = JSON.parse(authData)
      if (!parsedAuth.isAuthenticated) {
        router.push("/officer/login")
        return
      }
      setOfficerData(parsedAuth)
    } catch (error) {
      console.error("Error parsing auth data:", error)
      router.push("/officer/login")
      return
    }
  }, [router])

  const mockApplications: Application[] = [
    {
      id: "APP001",
      citizenName: "Harsha Kavinda",
      citizenEmail: "kavinda135@gmail.com",
      serviceType: "NIC Replacement",
      status: "submitted",
      submittedAt: new Date("2024-01-15"),
      appointmentDate: new Date("2024-01-20"),
      appointmentTime: "10:00 AM",
      documents: [
        { name: "Birth Certificate", status: "verified", uploadedAt: new Date("2024-01-15") },
        { name: "Police Report", status: "pending", uploadedAt: new Date("2024-01-15") },
      ],
      priority: "high",
      department: "Registration Department",
    },
    {
      id: "APP002",
      citizenName: "Saman Perera",
      citizenEmail: "saman@email.com",
      serviceType: "Passport Renewal",
      status: "under_review",
      submittedAt: new Date("2024-01-14"),
      appointmentDate: new Date("2024-01-22"),
      appointmentTime: "2:00 PM",
      documents: [
        { name: "Current Passport", status: "verified", uploadedAt: new Date("2024-01-14") },
        { name: "NIC Copy", status: "verified", uploadedAt: new Date("2024-01-14") },
      ],
      priority: "medium",
      department: "Registration Department",
    },
    {
      id: "APP003",
      citizenName: "Nimal Silva",
      citizenEmail: "nimal@email.com",
      serviceType: "Birth Certificate",
      status: "approved",
      submittedAt: new Date("2024-01-13"),
      documents: [
        { name: "Hospital Records", status: "verified", uploadedAt: new Date("2024-01-13") },
        { name: "Parent ID Copies", status: "verified", uploadedAt: new Date("2024-01-13") },
      ],
      priority: "low",
      department: "Registration Department",
    },
  ]

  const calculateStats = (apps: Application[]) => {
    const total = apps.length
    const pending = apps.filter((app) => app.status === "submitted").length
    const today = new Date().toDateString()
    const todayAppointments = apps.filter(
      (app) => app.appointmentDate && app.appointmentDate.toDateString() === today,
    ).length
    const completedToday = apps.filter(
      (app) => app.status === "completed" && app.submittedAt.toDateString() === today,
    ).length

    return {
      totalApplications: total,
      pendingReview: pending,
      todayAppointments,
      completedToday,
    }
  }

  useEffect(() => {
    const fetchApplications = async () => {
      setApplications(mockApplications)
      setStats(calculateStats(mockApplications))
      setLoading(false)
    }

    if (officerData) {
      fetchApplications()
    }
  }, [officerData])

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "under_review":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading || !officerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-govdocs-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading officer dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-govdocs-blue rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Officer Portal</h1>
                <p className="text-sm text-gray-600">{officerData?.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{officerData?.name}</p>
                  <p className="text-xs text-gray-600">Government Officer</p>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                </div>
                <FileText className="w-8 h-8 text-govdocs-blue" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingReview}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.todayAppointments}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Today</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completedToday}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Department Applications</CardTitle>
                <CardDescription>Manage applications for {officerData?.department}</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="applications" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="appointments">Today's Appointments</TabsTrigger>
                <TabsTrigger value="documents">Document Review</TabsTrigger>
              </TabsList>

              <TabsContent value="applications" className="space-y-4">
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No applications found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredApplications.map((app) => (
                      <Card key={app.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900">{app.citizenName}</h3>
                                <Badge className={getStatusColor(app.status)}>{app.status.replace("_", " ")}</Badge>
                                <Badge className={getPriorityColor(app.priority)}>{app.priority}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                <strong>Service:</strong> {app.serviceType}
                              </p>
                              <p className="text-sm text-gray-600 mb-1">
                                <strong>Application ID:</strong> {app.id}
                              </p>
                              <p className="text-sm text-gray-600 mb-1">
                                <strong>Submitted:</strong> {app.submittedAt.toLocaleDateString()}
                              </p>
                              {app.appointmentDate && (
                                <p className="text-sm text-gray-600">
                                  <strong>Appointment:</strong> {app.appointmentDate.toLocaleDateString()} at{" "}
                                  {app.appointmentTime}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Link href={`/officer/applications/${app.id}`}>
                                <Button variant="outline" size="sm">
                                  Review Documents
                                </Button>
                              </Link>
                              <Link href={`/officer/applications/${app.id}`}>
                                <Button size="sm" className="bg-govdocs-blue hover:bg-blue-700">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="appointments" className="space-y-4">
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Today's appointments will appear here</p>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Documents pending review will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

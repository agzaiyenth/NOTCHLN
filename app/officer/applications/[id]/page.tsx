"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  User,
  Phone,
  Mail,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

interface Document {
  id: string
  name: string
  type: string
  url: string
  status: "pending" | "verified" | "rejected"
  uploadedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  comments?: string
  size: string
}

interface Application {
  id: string
  citizenName: string
  citizenEmail: string
  citizenPhone: string
  serviceType: string
  status: "submitted" | "under_review" | "approved" | "rejected" | "completed"
  submittedAt: Date
  appointmentDate?: Date
  appointmentTime?: string
  documents: Document[]
  priority: "low" | "medium" | "high"
  department: string
  notes?: string
  communicationHistory: Array<{
    id: string
    from: "officer" | "citizen"
    message: string
    timestamp: Date
    type: "comment" | "request" | "response"
  }>
}

export default function ApplicationReviewPage() {
  const params = useParams()
  const router = useRouter()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [reviewComment, setReviewComment] = useState("")
  const [communicationMessage, setCommunicationMessage] = useState("")
  const [documentAction, setDocumentAction] = useState<"approve" | "reject" | null>(null)

  // Mock application data
  const mockApplication: Application = {
    id: params.id as string,
    citizenName: "Harsha Kavinda",
    citizenEmail: "kavinda135@gmail.com",
    citizenPhone: "+94 75 445 5445",
    serviceType: "NIC Replacement",
    status: "under_review",
    submittedAt: new Date("2024-01-15"),
    appointmentDate: new Date("2024-01-20"),
    appointmentTime: "10:00 AM",
    priority: "high",
    department: "Department of Registration of Persons",
    notes: "Lost NIC reported to police. Urgent replacement needed for job application.",
    documents: [
      {
        id: "doc1",
        name: "Birth Certificate",
        type: "PDF",
        url: "/birth-certificate-document.png",
        status: "verified",
        uploadedAt: new Date("2024-01-15"),
        reviewedAt: new Date("2024-01-16"),
        reviewedBy: "Officer Silva",
        comments: "Document is clear and valid",
        size: "2.3 MB",
      },
      {
        id: "doc2",
        name: "Police Report",
        type: "PDF",
        url: "/police-report-document.png",
        status: "pending",
        uploadedAt: new Date("2024-01-15"),
        size: "1.8 MB",
      },
      {
        id: "doc3",
        name: "Passport Photo",
        type: "JPG",
        url: "/passport-photo.png",
        status: "rejected",
        uploadedAt: new Date("2024-01-15"),
        reviewedAt: new Date("2024-01-16"),
        reviewedBy: "Officer Silva",
        comments: "Photo does not meet ICAO standards. Background should be white, not blue.",
        size: "856 KB",
      },
    ],
    communicationHistory: [
      {
        id: "comm1",
        from: "citizen",
        message:
          "I have submitted all required documents for my NIC replacement. Please let me know if anything else is needed.",
        timestamp: new Date("2024-01-15T10:30:00"),
        type: "comment",
      },
      {
        id: "comm2",
        from: "officer",
        message:
          "Thank you for your submission. I am currently reviewing your documents. The birth certificate looks good, but I need to verify the police report.",
        timestamp: new Date("2024-01-16T09:15:00"),
        type: "response",
      },
    ],
  }

  useEffect(() => {
    // Simulate loading application data
    setLoading(true)
    setTimeout(() => {
      setApplication(mockApplication)
      setLoading(false)
    }, 1000)
  }, [params.id])

  const handleDocumentReview = async (documentId: string, action: "approve" | "reject", comment: string) => {
    if (!application) return

    try {
      // Update document status
      const updatedDocuments = application.documents.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              status: action === "approve" ? ("verified" as const) : ("rejected" as const),
              reviewedAt: new Date(),
              reviewedBy: "Admin Officer",
              comments: comment,
            }
          : doc,
      )

      setApplication({
        ...application,
        documents: updatedDocuments,
      })

      toast({
        title: `Document ${action === "approve" ? "approved" : "rejected"}`,
        description: `${selectedDocument?.name} has been ${action === "approve" ? "approved" : "rejected"} successfully.`,
      })

      setSelectedDocument(null)
      setReviewComment("")
      setDocumentAction(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update document status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendMessage = async () => {
    if (!application || !communicationMessage.trim()) return

    try {
      const newMessage = {
        id: `comm${Date.now()}`,
        from: "officer" as const,
        message: communicationMessage,
        timestamp: new Date(),
        type: "request" as const,
      }

      setApplication({
        ...application,
        communicationHistory: [...application.communicationHistory, newMessage],
      })

      setCommunicationMessage("")

      toast({
        title: "Message sent",
        description: "Your message has been sent to the citizen.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-govdocs-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Application not found</p>
          <Button variant="outline" className="mt-4 bg-transparent" asChild>
            <Link href="/officer/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/officer/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Application Review</h1>
              <p className="text-gray-600">ID: {application.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Overview */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {application.citizenName}
                    </CardTitle>
                    <CardDescription>{application.serviceType}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(application.status)}>{application.status.replace("_", " ")}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{application.citizenEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{application.citizenPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Submitted: {application.submittedAt.toLocaleDateString()}</span>
                  </div>
                  {application.appointmentDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        Appointment: {application.appointmentDate.toLocaleDateString()} at {application.appointmentTime}
                      </span>
                    </div>
                  )}
                </div>
                {application.notes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Notes:</strong> {application.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Document Review */}
            <Card>
              <CardHeader>
                <CardTitle>Document Review</CardTitle>
                <CardDescription>Review and approve submitted documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application.documents.map((document) => (
                    <div key={document.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <div>
                            <h4 className="font-medium">{document.name}</h4>
                            <p className="text-sm text-gray-600">
                              {document.type} • {document.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(document.status)}>{document.status}</Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>

                      {document.status === "pending" && (
                        <div className="flex gap-2 mt-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  setSelectedDocument(document)
                                  setDocumentAction("approve")
                                }}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Approve Document</DialogTitle>
                                <DialogDescription>Add any comments about this document approval.</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="comment">Comments (Optional)</Label>
                                  <Textarea
                                    id="comment"
                                    placeholder="Document is clear and meets requirements..."
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                                    Cancel
                                  </Button>
                                  <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleDocumentReview(document.id, "approve", reviewComment)}
                                  >
                                    Approve Document
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedDocument(document)
                                  setDocumentAction("reject")
                                }}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Document</DialogTitle>
                                <DialogDescription>
                                  Please provide a reason for rejecting this document.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="reject-comment">Reason for Rejection *</Label>
                                  <Textarea
                                    id="reject-comment"
                                    placeholder="Please specify what needs to be corrected..."
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    required
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDocumentReview(document.id, "reject", reviewComment)}
                                    disabled={!reviewComment.trim()}
                                  >
                                    Reject Document
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}

                      {document.comments && (
                        <div
                          className={`mt-3 p-3 rounded-lg ${
                            document.status === "verified" ? "bg-green-50" : "bg-red-50"
                          }`}
                        >
                          <p
                            className={`text-sm ${document.status === "verified" ? "text-green-800" : "text-red-800"}`}
                          >
                            <strong>Review Comments:</strong> {document.comments}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Reviewed by {document.reviewedBy} on {document.reviewedAt?.toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-govdocs-blue hover:bg-blue-700">Schedule Appointment</Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Request Additional Documents
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Update Application Status
                </Button>
              </CardContent>
            </Card>

            {/* Communication */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Communication
                </CardTitle>
                <CardDescription>Send messages to the citizen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {application.communicationHistory.map((comm) => (
                    <div
                      key={comm.id}
                      className={`p-3 rounded-lg ${comm.from === "officer" ? "bg-blue-50 ml-4" : "bg-gray-50 mr-4"}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium text-gray-600">
                          {comm.from === "officer" ? "You" : application.citizenName}
                        </span>
                        <span className="text-xs text-gray-500">{comm.timestamp.toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-800">{comm.message}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Textarea
                    placeholder="Type your message to the citizen..."
                    value={communicationMessage}
                    onChange={(e) => setCommunicationMessage(e.target.value)}
                    rows={3}
                  />
                  <Button
                    className="w-full bg-govdocs-blue hover:bg-blue-700"
                    onClick={handleSendMessage}
                    disabled={!communicationMessage.trim()}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Application Status */}
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Application submitted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Under review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">Pending approval</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">Appointment scheduled</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

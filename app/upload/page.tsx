"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, XCircle, Clock, Camera, ArrowLeft, AlertCircle, Eye } from "lucide-react"
import Link from "next/link"

interface DocumentFile {
  id: string
  name: string
  type: string
  size: number
  status: "uploading" | "processing" | "verified" | "rejected" | "pending"
  progress: number
  verificationDetails?: {
    documentType: string
    extractedData: Record<string, string>
    issues: string[]
  }
}

const requiredDocuments = [
  {
    id: "police-report",
    name: "Police Report",
    description: "Official police report for lost NIC",
    required: true,
    formats: ["PDF", "JPG", "PNG"],
    maxSize: "5MB",
  },
  {
    id: "birth-certificate",
    name: "Birth Certificate",
    description: "Original birth certificate or certified copy",
    required: true,
    formats: ["PDF", "JPG", "PNG"],
    maxSize: "5MB",
  },
  {
    id: "passport-photo",
    name: "Passport Photo",
    description: "Recent passport-size photograph",
    required: true,
    formats: ["JPG", "PNG"],
    maxSize: "2MB",
  },
  {
    id: "proof-address",
    name: "Proof of Address",
    description: "Utility bill or bank statement (optional)",
    required: false,
    formats: ["PDF", "JPG", "PNG"],
    maxSize: "5MB",
  },
]

export default function DocumentUploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<DocumentFile[]>([])
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      const newFile: DocumentFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        status: "uploading",
        progress: 0,
      }

      setUploadedFiles((prev) => [...prev, newFile])

      const interval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((f) => {
            if (f.id === newFile.id) {
              const newProgress = Math.min(f.progress + Math.random() * 30, 100)
              if (newProgress >= 100) {
                clearInterval(interval)
                setTimeout(() => {
                  setUploadedFiles((prev) =>
                    prev.map((file) => (file.id === newFile.id ? { ...file, status: "processing" } : file)),
                  )

                  setTimeout(() => {
                    const isVerified = Math.random() > 0.2 
                    setUploadedFiles((prev) =>
                      prev.map((file) =>
                        file.id === newFile.id
                          ? {
                              ...file,
                              status: isVerified ? "verified" : "rejected",
                              verificationDetails: {
                                documentType: "Birth Certificate",
                                extractedData: {
                                  "Full Name": "Harsha Kavinda",
                                  "Date of Birth": "1990-03-15",
                                  "Place of Birth": "Colombo",
                                  "Registration Number": "BC/2025/001234",
                                },
                                issues: isVerified ? [] : ["Document quality too low", "Some text is unclear"],
                              },
                            }
                          : file,
                      ),
                    )
                  }, 2000)
                }, 1000)
              }
              return { ...f, progress: newProgress }
            }
            return f
          }),
        )
      }, 200)
    })
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const getStatusIcon = (status: DocumentFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <FileText className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: DocumentFile["status"]) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-700"
      case "rejected":
        return "bg-red-100 text-red-700"
      case "processing":
        return "bg-blue-100 text-blue-700"
      case "uploading":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const completedUploads = uploadedFiles.filter((f) => f.status === "verified").length
  const totalRequired = requiredDocuments.filter((d) => d.required).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/services" className="text-govdocs-blue hover:text-blue-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Document Upload</h1>
              <p className="text-gray-600">Upload and verify your required documents</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {completedUploads} of {totalRequired} required documents
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((completedUploads / totalRequired) * 100)}% Complete
            </span>
          </div>
          <Progress value={(completedUploads / totalRequired) * 100} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Drag & Drop Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>Drag and drop your files here or click to browse</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-govdocs-blue bg-blue-50"
                      : "border-gray-300 hover:border-govdocs-blue hover:bg-blue-50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-900">Drop your files here</p>
                    <p className="text-gray-600">or click to browse from your device</p>
                  </div>
                  <div className="flex gap-3 justify-center mt-6">
                    <Button className="bg-govdocs-blue hover:bg-blue-700" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <FileText className="w-4 h-4 mr-2" />
                        Choose Files
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileInput}
                          className="hidden"
                        />
                      </label>
                    </Button>
                    <Button variant="outline" className="bg-transparent">
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    Supported formats: PDF, JPG, PNG • Max size: 5MB per file
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Documents</CardTitle>
                  <CardDescription>Track the status of your uploaded documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getStatusIcon(file.status)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-gray-900 truncate">{file.name}</p>
                                <Badge className={getStatusColor(file.status)}>{file.status}</Badge>
                              </div>
                              <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

                              {file.status === "uploading" && (
                                <div className="mt-2">
                                  <Progress value={file.progress} className="h-1" />
                                  <p className="text-xs text-gray-500 mt-1">
                                    Uploading... {Math.round(file.progress)}%
                                  </p>
                                </div>
                              )}

                              {file.status === "processing" && (
                                <p className="text-sm text-blue-600 mt-1">Processing document with OCR...</p>
                              )}

                              {file.verificationDetails && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="text-sm font-medium mb-2">Extracted Information:</div>
                                  <div className="space-y-1">
                                    {Object.entries(file.verificationDetails.extractedData).map(([key, value]) => (
                                      <div key={key} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{key}:</span>
                                        <span className="font-medium">{value}</span>
                                      </div>
                                    ))}
                                  </div>

                                  {file.verificationDetails.issues.length > 0 && (
                                    <div className="mt-3 p-2 bg-red-50 rounded border-l-4 border-red-400">
                                      <div className="flex items-center gap-2 text-red-700 text-sm font-medium mb-1">
                                        <AlertCircle className="w-4 h-4" />
                                        Issues Found:
                                      </div>
                                      <ul className="text-sm text-red-600 space-y-1">
                                        {file.verificationDetails.issues.map((issue, index) => (
                                          <li key={index}>• {issue}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <Button size="sm" variant="outline" className="bg-transparent">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-transparent text-red-600 hover:text-red-700"
                              onClick={() => removeFile(file.id)}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Required Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Required Documents</CardTitle>
                  <CardDescription>Make sure to upload all required documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requiredDocuments.map((doc) => {
                      const uploaded = uploadedFiles.find((f) =>
                        f.name.toLowerCase().includes(doc.id.replace("-", " ")),
                      )

                      return (
                        <div key={doc.id} className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm">{doc.name}</h4>
                                {doc.required && (
                                  <Badge variant="outline" className="text-xs bg-transparent">
                                    Required
                                  </Badge>
                                )}
                                {uploaded && getStatusIcon(uploaded.status)}
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{doc.description}</p>
                              <div className="text-xs text-gray-500 mt-1">
                                {doc.formats.join(", ")} • Max {doc.maxSize}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upload Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Ensure documents are clear and readable</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Use good lighting when taking photos</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Avoid shadows and glare</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Include all four corners of the document</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Continue Button */}
              {completedUploads >= totalRequired && (
                <Card>
                  <CardContent className="pt-6">
                    <Button size="lg" className="w-full bg-govdocs-blue hover:bg-blue-700" asChild>
                      <Link href="/dashboard">Continue to Dashboard</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

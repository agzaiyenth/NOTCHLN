"use client"

import type React from "react"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, XCircle, Clock } from "lucide-react"

interface DocumentFile {
  id: string
  name: string
  status: "uploading" | "verified" | "rejected"
  progress: number
}

interface DocumentUploadProps {
  onUploadComplete?: (files: DocumentFile[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
}

export default function DocumentUpload({
  onUploadComplete,
  maxFiles = 5,
  acceptedTypes = [".pdf", ".jpg", ".jpeg", ".png"],
}: DocumentUploadProps) {
  const [files, setFiles] = useState<DocumentFile[]>([])
  const prevFilesRef = useRef<DocumentFile[]>([])
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

  const handleFiles = (newFiles: File[]) => {
    const filesToAdd = newFiles.slice(0, maxFiles - files.length)

    filesToAdd.forEach((file) => {
      const newFile: DocumentFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        status: "uploading",
        progress: 0,
      }

      setFiles((prev) => [...prev, newFile])

      // Simulate upload progress
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === newFile.id) {
              const newProgress = Math.min(f.progress + Math.random() * 25, 100)
              if (newProgress >= 100) {
                clearInterval(interval)
                const finalStatus = Math.random() > 0.1 ? "verified" : "rejected"
                setTimeout(() => {
                  setFiles((prev) =>
                    prev.map((file) =>
                      file.id === newFile.id ? { ...file, status: finalStatus as "verified" | "rejected" } : file,
                    ),
                  )
                }, 500)
              }
              return { ...f, progress: newProgress }
            }
            return f
          }),
        )
      }, 200)
    })
  }

  // Call onUploadComplete only after all files are done uploading (not during render)
  useEffect(() => {
    // Only run if files changed
    if (prevFilesRef.current !== files) {
      // Check if all files are uploaded (not uploading)
      if (files.length > 0 && files.every((f) => f.status !== "uploading")) {
        onUploadComplete?.(files)
      }
      prevFilesRef.current = files
    }
  }, [files, onUploadComplete])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const getStatusIcon = (status: DocumentFile["status"]) => {
    switch (status) {
      case "uploading":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
      case "verified":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardContent className="pt-6">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? "border-govdocs-blue bg-blue-50"
                : "border-gray-300 hover:border-govdocs-blue hover:bg-blue-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="font-medium text-gray-900 mb-1">Drop files here or click to upload</p>
            <p className="text-sm text-gray-600 mb-4">
              {acceptedTypes.join(", ")} • Max {maxFiles} files
            </p>
            <Button size="sm" className="bg-govdocs-blue hover:bg-blue-700" asChild>
              <label htmlFor="file-upload-component" className="cursor-pointer">
                <FileText className="w-4 h-4 mr-2" />
                Choose Files
                <input
                  id="file-upload-component"
                  type="file"
                  multiple
                  accept={acceptedTypes.join(",")}
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(file.status)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{file.name}</p>
                      {file.status === "uploading" && (
                        <div className="mt-1">
                          <Progress value={file.progress} className="h-1" />
                          <p className="text-xs text-gray-500 mt-1">{Math.round(file.progress)}%</p>
                        </div>
                      )}
                      {file.status === "verified" && <p className="text-xs text-green-600">Verified successfully</p>}
                      {file.status === "rejected" && <p className="text-xs text-red-600">Verification failed</p>}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="bg-transparent" onClick={() => removeFile(file.id)}>
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

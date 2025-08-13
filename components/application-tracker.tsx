import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"

interface ApplicationTrackerProps {
  applicationId: string
  status: "submitted" | "processing" | "ready" | "completed"
  progress: number
  steps?: {
    title: string
    completed: boolean
    current?: boolean
  }[]
}

export default function ApplicationTracker({
  applicationId,
  status,
  progress,
  steps = [
    { title: "Submitted", completed: progress >= 25 },
    { title: "Processing", completed: progress >= 50 },
    { title: "Ready", completed: progress >= 75 },
    { title: "Completed", completed: progress >= 100 },
  ],
}: ApplicationTrackerProps) {
  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Application: {applicationId}</span>
        <Badge className={getStatusColor(status)}>
          {getStatusIcon(status)}
          <span className="ml-1 capitalize">{status}</span>
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step.completed ? "bg-govdocs-blue text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {step.completed ? <CheckCircle className="w-3 h-3" /> : index + 1}
            </div>
            <span className={`text-xs mt-1 ${step.completed ? "text-govdocs-blue" : "text-gray-500"}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

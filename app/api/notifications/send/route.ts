import { type NextRequest, NextResponse } from "next/server"
import { notificationService } from "@/lib/notification-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, userId, userEmail, userName, applicationId, ...params } = body

    let notificationId: string | null = null

    switch (type) {
      case "appointment_confirmation":
        notificationId = await notificationService.scheduleAppointmentConfirmation(
          userId,
          userEmail,
          userName,
          applicationId,
          params.serviceType,
          new Date(params.appointmentDate),
          params.appointmentTime,
          params.location,
          params.officerName,
        )
        break

      case "appointment_reminder":
        notificationId = await notificationService.scheduleAppointmentReminder(
          userId,
          userEmail,
          userName,
          applicationId,
          params.serviceType,
          new Date(params.appointmentDate),
          params.appointmentTime,
          params.location,
          params.officerName,
        )
        break

      case "status_update":
        notificationId = await notificationService.sendStatusUpdate(
          userId,
          userEmail,
          userName,
          applicationId,
          params.serviceType,
          params.newStatus,
          params.updateMessage,
          params.officerName,
          params.department,
          params.actionRequired,
          params.actionMessage,
        )
        break

      case "document_rejected":
        notificationId = await notificationService.sendDocumentRejection(
          userId,
          userEmail,
          userName,
          applicationId,
          params.serviceType,
          params.documentName,
          params.rejectionReason,
          params.correctionInstructions,
          params.officerName,
          params.department,
        )
        break

      default:
        return NextResponse.json({ error: "Invalid notification type" }, { status: 400 })
    }

    if (notificationId) {
      return NextResponse.json({
        success: true,
        notificationId,
        message: "Notification scheduled successfully",
      })
    } else {
      return NextResponse.json(
        {
          error: "Failed to schedule notification",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in notification API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

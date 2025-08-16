import { db, isFirebaseAvailable } from "./firebase"
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore"

export interface NotificationTemplate {
  id: string
  type:
    | "appointment_confirmation"
    | "appointment_reminder"
    | "status_update"
    | "document_request"
    | "document_approved"
    | "document_rejected"
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
}

export interface Notification {
  id?: string
  userId: string
  userEmail: string
  userName: string
  type: NotificationTemplate["type"]
  subject: string
  content: string
  status: "pending" | "sent" | "failed"
  scheduledFor?: Date
  sentAt?: Date
  applicationId?: string
  metadata?: Record<string, any>
  createdAt: Date
}

export interface DocumentChecklistItem {
  name: string
  required: boolean
  description: string
}

class NotificationService {
  private templates: NotificationTemplate[] = [
    {
      id: "appointment_confirmation",
      type: "appointment_confirmation",
      subject: "GovDocs: Appointment Confirmed - {{serviceType}}",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2850EE; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">GovDocs</h1>
            <p style="margin: 5px 0 0 0;">Your AI Document Assistant</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #2850EE; margin-bottom: 20px;">Appointment Confirmed</h2>
            
            <p>Dear {{citizenName}},</p>
            
            <p>Your appointment for <strong>{{serviceType}}</strong> has been confirmed.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2850EE;">Appointment Details</h3>
              <p><strong>Service:</strong> {{serviceType}}</p>
              <p><strong>Date:</strong> {{appointmentDate}}</p>
              <p><strong>Time:</strong> {{appointmentTime}}</p>
              <p><strong>Location:</strong> {{location}}</p>
              <p><strong>Officer:</strong> {{officerName}}</p>
              <p><strong>Application ID:</strong> {{applicationId}}</p>
            </div>
            
            <p>You will receive a reminder 24 hours before your appointment with a checklist of documents to bring.</p>
            
            <p>If you need to reschedule or have any questions, please contact us through the GovDocs platform.</p>
            
            <p>Best regards,<br>The GovDocs Team</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p>This is an automated message from GovDocs. Please do not reply to this email.</p>
          </div>
        </div>
      `,
      textContent: `
        GovDocs - Appointment Confirmed
        
        Dear {{citizenName}},
        
        Your appointment for {{serviceType}} has been confirmed.
        
        Appointment Details:
        - Service: {{serviceType}}
        - Date: {{appointmentDate}}
        - Time: {{appointmentTime}}
        - Location: {{location}}
        - Officer: {{officerName}}
        - Application ID: {{applicationId}}
        
        You will receive a reminder 24 hours before your appointment with a checklist of documents to bring.
        
        If you need to reschedule or have any questions, please contact us through the GovDocs platform.
        
        Best regards,
        The GovDocs Team
      `,
      variables: [
        "citizenName",
        "serviceType",
        "appointmentDate",
        "appointmentTime",
        "location",
        "officerName",
        "applicationId",
      ],
    },
    {
      id: "appointment_reminder",
      type: "appointment_reminder",
      subject: "GovDocs: Appointment Reminder Tomorrow - {{serviceType}}",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2850EE; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">GovDocs</h1>
            <p style="margin: 5px 0 0 0;">Your AI Document Assistant</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #2850EE; margin-bottom: 20px;">🔔 Appointment Reminder</h2>
            
            <p>Dear {{citizenName}},</p>
            
            <p>This is a friendly reminder that you have an appointment <strong>tomorrow</strong> for {{serviceType}}.</p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #856404;">⏰ Appointment Details</h3>
              <p><strong>Date:</strong> {{appointmentDate}}</p>
              <p><strong>Time:</strong> {{appointmentTime}}</p>
              <p><strong>Location:</strong> {{location}}</p>
              <p><strong>Officer:</strong> {{officerName}}</p>
            </div>
            
            <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #0c5460;">📋 Required Documents Checklist</h3>
              <p>Please bring the following <strong>original documents</strong>:</p>
              {{documentChecklist}}
              <p style="margin-top: 15px; font-weight: bold; color: #0c5460;">⚠️ Important: Bring original documents, not photocopies.</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #2850EE;">Additional Reminders:</h4>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Arrive 15 minutes early</li>
                <li>Bring a valid photo ID</li>
                <li>Have your application ID ready: {{applicationId}}</li>
                <li>Wear appropriate attire</li>
              </ul>
            </div>
            
            <p>If you cannot attend, please reschedule through the GovDocs platform as soon as possible.</p>
            
            <p>Best regards,<br>The GovDocs Team</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p>This is an automated reminder from GovDocs. Please do not reply to this email.</p>
          </div>
        </div>
      `,
      textContent: `
        GovDocs - Appointment Reminder Tomorrow
        
        Dear {{citizenName}},
        
        This is a friendly reminder that you have an appointment tomorrow for {{serviceType}}.
        
        Appointment Details:
        - Date: {{appointmentDate}}
        - Time: {{appointmentTime}}
        - Location: {{location}}
        - Officer: {{officerName}}
        
        Required Documents Checklist:
        Please bring the following original documents:
        {{documentChecklistText}}
        
        Important: Bring original documents, not photocopies.
        
        Additional Reminders:
        - Arrive 15 minutes early
        - Bring a valid photo ID
        - Have your application ID ready: {{applicationId}}
        - Wear appropriate attire
        
        If you cannot attend, please reschedule through the GovDocs platform as soon as possible.
        
        Best regards,
        The GovDocs Team
      `,
      variables: [
        "citizenName",
        "serviceType",
        "appointmentDate",
        "appointmentTime",
        "location",
        "officerName",
        "applicationId",
        "documentChecklist",
        "documentChecklistText",
      ],
    },
    {
      id: "status_update",
      type: "status_update",
      subject: "GovDocs: Application Status Update - {{serviceType}}",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2850EE; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">GovDocs</h1>
            <p style="margin: 5px 0 0 0;">Your AI Document Assistant</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #2850EE; margin-bottom: 20px;">Application Status Update</h2>
            
            <p>Dear {{citizenName}},</p>
            
            <p>There has been an update to your {{serviceType}} application.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2850EE;">Application Details</h3>
              <p><strong>Application ID:</strong> {{applicationId}}</p>
              <p><strong>Service:</strong> {{serviceType}}</p>
              <p><strong>New Status:</strong> <span style="background: {{statusColor}}; color: white; padding: 4px 8px; border-radius: 4px;">{{newStatus}}</span></p>
            </div>
            
            <div style="background: #e7f3ff; border: 1px solid #b3d9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #0066cc;">📝 Update Details</h3>
              <p>{{updateMessage}}</p>
            </div>
            
            {{#if actionRequired}}
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #856404;">⚠️ Action Required</h3>
              <p>{{actionMessage}}</p>
            </div>
            {{/if}}
            
            <p>You can view the full details and any required actions by logging into your GovDocs dashboard.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{dashboardUrl}}" style="background: #2850EE; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Dashboard</a>
            </div>
            
            <p>Best regards,<br>{{officerName}}<br>{{department}}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p>This is an automated message from GovDocs. Please do not reply to this email.</p>
          </div>
        </div>
      `,
      textContent: `
        GovDocs - Application Status Update
        
        Dear {{citizenName}},
        
        There has been an update to your {{serviceType}} application.
        
        Application Details:
        - Application ID: {{applicationId}}
        - Service: {{serviceType}}
        - New Status: {{newStatus}}
        
        Update Details:
        {{updateMessage}}
        
        {{#if actionRequired}}
        Action Required:
        {{actionMessage}}
        {{/if}}
        
        You can view the full details and any required actions by logging into your GovDocs dashboard.
        
        Dashboard: {{dashboardUrl}}
        
        Best regards,
        {{officerName}}
        {{department}}
      `,
      variables: [
        "citizenName",
        "serviceType",
        "applicationId",
        "newStatus",
        "statusColor",
        "updateMessage",
        "actionRequired",
        "actionMessage",
        "dashboardUrl",
        "officerName",
        "department",
      ],
    },
    {
      id: "document_rejected",
      type: "document_rejected",
      subject: "GovDocs: Document Review Required - {{serviceType}}",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2850EE; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">GovDocs</h1>
            <p style="margin: 5px 0 0 0;">Your AI Document Assistant</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #dc3545; margin-bottom: 20px;">📄 Document Review Required</h2>
            
            <p>Dear {{citizenName}},</p>
            
            <p>We have reviewed your documents for {{serviceType}} and found that some corrections are needed.</p>
            
            <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #721c24;">❌ Document Issues Found</h3>
              <p><strong>Document:</strong> {{documentName}}</p>
              <p><strong>Issue:</strong> {{rejectionReason}}</p>
            </div>
            
            <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #0c5460;">🔧 What You Need to Do</h3>
              <p>{{correctionInstructions}}</p>
            </div>
            
            <p>Please upload the corrected document through your GovDocs dashboard. Once you've made the necessary corrections, our team will review it again.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{dashboardUrl}}" style="background: #2850EE; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Upload Corrected Document</a>
            </div>
            
            <p>If you have any questions about these requirements, please don't hesitate to contact us through the platform.</p>
            
            <p>Best regards,<br>{{officerName}}<br>{{department}}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p>This is an automated message from GovDocs. Please do not reply to this email.</p>
          </div>
        </div>
      `,
      textContent: `
        GovDocs - Document Review Required
        
        Dear {{citizenName}},
        
        We have reviewed your documents for {{serviceType}} and found that some corrections are needed.
        
        Document Issues Found:
        - Document: {{documentName}}
        - Issue: {{rejectionReason}}
        
        What You Need to Do:
        {{correctionInstructions}}
        
        Please upload the corrected document through your GovDocs dashboard. Once you've made the necessary corrections, our team will review it again.
        
        Dashboard: {{dashboardUrl}}
        
        If you have any questions about these requirements, please don't hesitate to contact us through the platform.
        
        Best regards,
        {{officerName}}
        {{department}}
      `,
      variables: [
        "citizenName",
        "serviceType",
        "documentName",
        "rejectionReason",
        "correctionInstructions",
        "dashboardUrl",
        "officerName",
        "department",
      ],
    },
  ]

  private replaceVariables(template: string, variables: Record<string, any>): string {
    let result = template
    Object.keys(variables).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g")
      result = result.replace(regex, variables[key] || "")
    })
    return result
  }

  private generateDocumentChecklist(serviceType: string): { html: string; text: string } {
    const checklists: Record<string, DocumentChecklistItem[]> = {
      "NIC Replacement": [
        { name: "Birth Certificate", required: true, description: "Original birth certificate or certified copy" },
        { name: "Police Report", required: true, description: "Original police report for lost NIC" },
        {
          name: "ICAO Standard Photograph",
          required: true,
          description: "Recent passport-size photo with white background",
        },
        { name: "Previous NIC", required: false, description: "If available (damaged NIC)" },
      ],
      "Passport Renewal": [
        { name: "Current Passport", required: true, description: "Original current/expired passport" },
        { name: "National Identity Card", required: true, description: "Original NIC" },
        { name: "Birth Certificate", required: true, description: "Original birth certificate" },
        { name: "Marriage Certificate", required: false, description: "If name change after marriage" },
      ],
      "Birth Certificate": [
        { name: "Hospital Birth Records", required: true, description: "Original hospital birth certificate" },
        { name: "Parent ID Cards", required: true, description: "Original NICs of both parents" },
        { name: "Marriage Certificate", required: true, description: "Original marriage certificate of parents" },
      ],
    }

    const items = checklists[serviceType] || []

    const html = items
      .map(
        (item) =>
          `<div style="margin: 8px 0; padding: 8px; background: white; border-radius: 4px;">
        <strong>${item.required ? "✅" : "📄"} ${item.name}</strong>
        ${item.required ? ' <span style="color: #dc3545;">(Required)</span>' : ' <span style="color: #6c757d;">(Optional)</span>'}
        <br><small style="color: #666;">${item.description}</small>
      </div>`,
      )
      .join("")

    const text = items
      .map((item) => `- ${item.name} ${item.required ? "(Required)" : "(Optional)"}: ${item.description}`)
      .join("\n")

    return { html, text }
  }

  async sendNotification(notification: Omit<Notification, "id" | "createdAt">): Promise<string | null> {
    try {
      const newNotification: Notification = {
        ...notification,
        createdAt: new Date(),
      }

      if (isFirebaseAvailable() && db) {
        const docRef = await addDoc(collection(db, "notifications"), newNotification)
        console.log(`Notification queued with ID: ${docRef.id}`)
        return docRef.id
      } else {
        // Offline mode - simulate sending
        console.log("Offline mode: Notification would be sent:", newNotification)
        return `offline_${Date.now()}`
      }
    } catch (error) {
      console.error("Error sending notification:", error)
      return null
    }
  }

  async scheduleAppointmentConfirmation(
    userId: string,
    userEmail: string,
    userName: string,
    applicationId: string,
    serviceType: string,
    appointmentDate: Date,
    appointmentTime: string,
    location: string,
    officerName: string,
  ): Promise<string | null> {
    const template = this.templates.find((t) => t.type === "appointment_confirmation")
    if (!template) return null

    const variables = {
      citizenName: userName,
      serviceType,
      appointmentDate: appointmentDate.toLocaleDateString(),
      appointmentTime,
      location,
      officerName,
      applicationId,
    }

    const subject = this.replaceVariables(template.subject, variables)
    const content = this.replaceVariables(template.htmlContent, variables)

    return this.sendNotification({
      userId,
      userEmail,
      userName,
      type: "appointment_confirmation",
      subject,
      content,
      status: "pending",
      applicationId,
      metadata: { serviceType, appointmentDate: appointmentDate.toISOString(), appointmentTime },
    })
  }

  async scheduleAppointmentReminder(
    userId: string,
    userEmail: string,
    userName: string,
    applicationId: string,
    serviceType: string,
    appointmentDate: Date,
    appointmentTime: string,
    location: string,
    officerName: string,
  ): Promise<string | null> {
    const template = this.templates.find((t) => t.type === "appointment_reminder")
    if (!template) return null

    const checklist = this.generateDocumentChecklist(serviceType)
    const reminderDate = new Date(appointmentDate)
    reminderDate.setDate(reminderDate.getDate() - 1) // 24 hours before

    const variables = {
      citizenName: userName,
      serviceType,
      appointmentDate: appointmentDate.toLocaleDateString(),
      appointmentTime,
      location,
      officerName,
      applicationId,
      documentChecklist: checklist.html,
      documentChecklistText: checklist.text,
    }

    const subject = this.replaceVariables(template.subject, variables)
    const content = this.replaceVariables(template.htmlContent, variables)

    return this.sendNotification({
      userId,
      userEmail,
      userName,
      type: "appointment_reminder",
      subject,
      content,
      status: "pending",
      scheduledFor: reminderDate,
      applicationId,
      metadata: { serviceType, appointmentDate: appointmentDate.toISOString(), appointmentTime },
    })
  }

  async sendStatusUpdate(
    userId: string,
    userEmail: string,
    userName: string,
    applicationId: string,
    serviceType: string,
    newStatus: string,
    updateMessage: string,
    officerName: string,
    department: string,
    actionRequired = false,
    actionMessage?: string,
  ): Promise<string | null> {
    const template = this.templates.find((t) => t.type === "status_update")
    if (!template) return null

    const statusColors: Record<string, string> = {
      approved: "#28a745",
      rejected: "#dc3545",
      under_review: "#ffc107",
      completed: "#6c757d",
    }

    const variables = {
      citizenName: userName,
      serviceType,
      applicationId,
      newStatus,
      statusColor: statusColors[newStatus] || "#6c757d",
      updateMessage,
      actionRequired,
      actionMessage: actionMessage || "",
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
      officerName,
      department,
    }

    const subject = this.replaceVariables(template.subject, variables)
    const content = this.replaceVariables(template.htmlContent, variables)

    return this.sendNotification({
      userId,
      userEmail,
      userName,
      type: "status_update",
      subject,
      content,
      status: "pending",
      applicationId,
      metadata: { serviceType, newStatus, officerName, department },
    })
  }

  async sendDocumentRejection(
    userId: string,
    userEmail: string,
    userName: string,
    applicationId: string,
    serviceType: string,
    documentName: string,
    rejectionReason: string,
    correctionInstructions: string,
    officerName: string,
    department: string,
  ): Promise<string | null> {
    const template = this.templates.find((t) => t.type === "document_rejected")
    if (!template) return null

    const variables = {
      citizenName: userName,
      serviceType,
      documentName,
      rejectionReason,
      correctionInstructions,
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
      officerName,
      department,
    }

    const subject = this.replaceVariables(template.subject, variables)
    const content = this.replaceVariables(template.htmlContent, variables)

    return this.sendNotification({
      userId,
      userEmail,
      userName,
      type: "document_rejected",
      subject,
      content,
      status: "pending",
      applicationId,
      metadata: { serviceType, documentName, rejectionReason, officerName, department },
    })
  }

  async getNotificationHistory(userId: string, limit = 20): Promise<Notification[]> {
    try {
      if (isFirebaseAvailable() && db) {
        const q = query(
          collection(db, "notifications"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc"),
          limit(limit),
        )
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notification[]
      } else {
        // Offline mode - return mock data
        return []
      }
    } catch (error) {
      console.error("Error fetching notification history:", error)
      return []
    }
  }
}

export const notificationService = new NotificationService()

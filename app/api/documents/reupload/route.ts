import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore"

export async function POST(request: NextRequest) {
  try {
    const { applicationId, documentName, userId } = await request.json()

    if (!applicationId || !documentName || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get the current application
    const applicationRef = doc(db, "applications", applicationId)
    const applicationDoc = await getDoc(applicationRef)

    if (!applicationDoc.exists()) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const applicationData = applicationDoc.data()

    // Verify the user owns this application
    if (applicationData.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update the specific document status
    const updatedDocuments = applicationData.documents.map((doc: any) => {
      if (doc.name === documentName) {
        return {
          ...doc,
          status: "pending",
          reuploadedAt: serverTimestamp(),
          version: (doc.version || 1) + 1,
        }
      }
      return doc
    })

    // Update the application
    await updateDoc(applicationRef, {
      documents: updatedDocuments,
      updatedAt: serverTimestamp(),
      lastActivity: {
        action: "Document re-uploaded",
        document: documentName,
        timestamp: serverTimestamp(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Document re-uploaded successfully",
    })
  } catch (error) {
    console.error("Document reupload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

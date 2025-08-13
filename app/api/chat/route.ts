import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(req: Request) {
  const { message, conversationHistory } = await req.json()

  const simulatedResponse = getSimulatedResponse(message, conversationHistory)

  if (simulatedResponse) {
    return new Response(JSON.stringify(simulatedResponse), {
      headers: { "Content-Type": "application/json" },
    })
  }

  if (!process.env.GROQ_API_KEY) {
    const fallbackResponse = getEnhancedFallbackResponse(message)
    return new Response(JSON.stringify(fallbackResponse), {
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const result = await generateText({
      model: groq("llama3-70b-8192"),
      system: `You are GovDocs AI, a helpful assistant for Sri Lankan government document services. 
      
      You help citizens with:
      - NIC (National Identity Card) applications and renewals
      - Passport applications and renewals  
      - Birth certificate registration
      - Driving license applications
      - Marriage certificate registration
      - Death certificate registration
      
      Always be helpful, professional, and guide users through the step-by-step process. 
      If you don't know specific government procedures, acknowledge it and suggest contacting the relevant office.
      
      Keep responses concise and actionable.`,
      prompt: `User message: ${message}\n\nConversation history: ${JSON.stringify(conversationHistory)}`,
    })

    return new Response(
      JSON.stringify({
        message: result.text,
        quickReplies: [
          "Tell me more",
          "What documents do I need?",
          "Book appointment",
          "Need help with something else",
        ],
        source: "ai",
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Groq API Error:", error)
    const fallbackResponse = getEnhancedFallbackResponse(message)
    return new Response(JSON.stringify(fallbackResponse), {
      headers: { "Content-Type": "application/json" },
    })
  }
}

function getSimulatedResponse(message: string, history: any[]) {
  const msg = message.toLowerCase()

  // NIC replacement flow with enhanced UI
  if (msg.includes("lost") && msg.includes("nic")) {
    return {
      message:
        "I'll help you replace your lost NIC. This is a step-by-step process that I'll guide you through. Where did you lose your NIC?",
      quickReplies: ["At home", "Public place", "Not sure"],
      source: "simulated",
    }
  }

  // Location response
  if (["at home", "public place", "not sure"].some((option) => msg.includes(option.toLowerCase()))) {
    if (msg.includes("public")) {
      return {
        message: "Since you lost it in a public place, you'll need a police report first. Do you have a police report?",
        quickReplies: ["Yes, I have it", "No, not yet", "How do I get one?"],
        source: "simulated",
      }
    } else {
      return {
        message:
          "Great! Since you lost it at home, you won't need a police report. Please upload the following documents:",
        showUpload: true,
        quickReplies: ["What documents do I need?"],
        source: "simulated",
      }
    }
  }

  // Police report responses
  if (msg.includes("yes") || msg.includes("have it")) {
    return {
      message:
        "Perfect! Now I need you to upload some documents:\n\n1. Police report\n2. Birth certificate\n3. Recent passport photo",
      showUpload: true,
      source: "simulated",
    }
  }

  // Document upload simulation
  if (msg.includes("uploaded") || msg.includes("documents")) {
    return {
      message:
        "✅ Documents verified successfully!\n\n• Police report - Verified\n• Birth certificate - Verified\n• Passport photo - Verified\n\nNow I need to book an appointment for you. Who will attest your form?",
      quickReplies: ["Grama Niladhari", "Principal", "Estate Superintendent"],
      source: "simulated",
    }
  }

  // Appointment booking
  if (["grama niladhari", "principal", "estate superintendent"].some((option) => msg.includes(option.toLowerCase()))) {
    return {
      message: `Perfect! I'll book an appointment with the ${message}. Here are available slots:`,
      showCalendar: true,
      quickReplies: ["Tuesday 10 AM", "Friday 2 PM", "Monday 9 AM"],
      source: "simulated",
    }
  }

  // Time slot selection
  if (msg.includes("tuesday") || msg.includes("friday") || msg.includes("monday")) {
    return {
      message: `Excellent! I've booked your appointment for ${message}.\n\nNow let's process the payment:\n• NIC replacement fee: Rs. 1,000.00`,
      showPayment: true,
      quickReplies: ["Pay with Card", "Mobile Wallet", "Bank Transfer"],
      source: "simulated",
    }
  }

  // Payment
  if (msg.includes("pay") || msg.includes("card") || msg.includes("wallet")) {
    return {
      message:
        "✅ Payment successful! Your application has been submitted.\n\n📋 Application ID: NIC2025001\n📅 Appointment: Tuesday 10 AM\n💰 Amount Paid: Rs. 1,000.00\n📍 Location: Battaramulla Head Office",
      quickReplies: ["Track my application", "Download receipt", "Need help with something else"],
      source: "simulated",
    }
  }

  // General NIC queries
  if (msg.includes("nic") || msg.includes("identity card")) {
    if (msg.includes("renew") || msg.includes("expired")) {
      return {
        message:
          "For NIC renewal, you'll need:\n\n1. Current NIC (even if expired)\n2. Recent photograph\n3. Renewal fee (Rs. 500)\n\nWould you like me to help you book an appointment?",
        quickReplies: ["Book appointment", "What documents needed?", "Check fees"],
        source: "simulated",
      }
    }
    return {
      message: "I can help you with NIC services! What do you need assistance with?",
      quickReplies: ["Apply for new NIC", "Renew existing NIC", "Replace lost/damaged NIC"],
      source: "simulated",
    }
  }

  // Passport Process Flow
  if (msg.includes("passport")) {
    return {
      message: "I can help you with passport services! What type of service do you need?",
      quickReplies: ["New passport application", "Passport renewal", "Check passport status"],
      source: "simulated",
    }
  }

  // Birth Certificate
  if (msg.includes("birth certificate")) {
    return {
      message:
        "For birth certificate registration, you'll need:\n\n1. Hospital birth record\n2. Parents' NICs\n3. Marriage certificate of parents\n\nShall I guide you through the process?",
      quickReplies: ["Start application", "Check requirements", "Book appointment"],
      source: "simulated",
    }
  }

  // Driving License
  if (msg.includes("driving license") || msg.includes("licence")) {
    return {
      message: "I can help you with driving license services. What do you need?",
      quickReplies: ["Learner's permit", "Regular license", "License renewal"],
      source: "simulated",
    }
  }

  // Return null if no simulated response matches
  return null
}

function getEnhancedFallbackResponse(message: string) {
  const msg = message.toLowerCase()

  // Try to provide helpful responses for common queries
  if (msg.includes("help") || msg.includes("how") || msg.includes("what")) {
    return {
      message:
        "I'm here to help you with government document services! I can assist with NIC, passport, birth certificate, driving license, and other document applications. What specific service do you need help with?",
      quickReplies: ["NIC services", "Passport services", "Birth certificate", "Driving license"],
      source: "fallback",
    }
  }

  if (msg.includes("fee") || msg.includes("cost") || msg.includes("price")) {
    return {
      message:
        "Government service fees vary by document type:\n\n• NIC renewal: Rs. 500\n• Passport fees: Starting from Rs. 3,000\n• Birth certificate: Rs. 200\n\nWould you like specific fee information for a particular service?",
      quickReplies: ["NIC fees", "Passport fees", "Other document fees"],
      source: "fallback",
    }
  }

  if (msg.includes("time") || msg.includes("duration") || msg.includes("long")) {
    return {
      message:
        "Processing times vary by service:\n\n• NIC renewal: 7-10 days\n• Passport: 2-3 weeks\n• Birth certificate: 3-5 days\n\nI can help you track your application status. Which document are you inquiring about?",
      quickReplies: ["Track NIC", "Track passport", "Track other documents"],
      source: "fallback",
    }
  }

  if (msg.includes("appointment") || msg.includes("book") || msg.includes("schedule")) {
    return {
      message:
        "I can help you book appointments for various government services. Which service would you like to schedule an appointment for?",
      quickReplies: ["NIC appointment", "Passport appointment", "Other services"],
      source: "fallback",
    }
  }

  // Generic helpful response
  return {
    message:
      "I understand you need assistance with government document services. I can help you with common processes like NIC, passport, birth certificate, and driving license applications. Could you please specify which service you need help with?",
    quickReplies: ["NIC services", "Passport services", "Birth certificate", "Driving license"],
    source: "fallback",
  }
}

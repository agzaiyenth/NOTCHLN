"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, MessageCircle, ArrowLeft, Calendar, CreditCard } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import DocumentUpload from "@/components/document-upload"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  quickReplies?: string[]
  showUpload?: boolean
  showCalendar?: boolean
  showPayment?: boolean
}

const initialMessages: Message[] = [
  {
    id: "1",
    type: "ai",
    content:
      "Hello! I'm your GovDocs AI assistant. I'm here to help you with any government document needs. What can I help you with today?",
    timestamp: new Date(),
    quickReplies: ["I lost my NIC", "Renew passport", "Birth certificate", "Driving license", "Business registration"],
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (content: string, type: "user" | "ai", options?: Partial<Message>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      ...options,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const simulateAIResponse = async (userMessage: string) => {
    console.log("Sending message:", userMessage) 
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.slice(-5),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Received response:", data)
      setIsTyping(false)

      addMessage(data.message, "ai", {
        quickReplies: data.quickReplies || [],
        showUpload: data.showUpload || false,
        showCalendar: data.showCalendar || false,
        showPayment: data.showPayment || false,
      })
    } catch (error) {
      console.error("Chat API Error:", error) 
      setIsTyping(false)
      addMessage(
        "I'm having trouble processing your request right now. Please try again or contact our support team.",
        "ai",
        {
          quickReplies: ["Try again", "Contact support", "Go to dashboard"],
        },
      )
    }
  }

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      console.log("Sending message via input:", inputValue) 
      addMessage(inputValue, "user")
      simulateAIResponse(inputValue)
      setInputValue("")
    }
  }

  const handleQuickReply = (reply: string) => {
    console.log("Quick reply clicked:", reply)
    // If payment is required, redirect to payment page
    const lastAiMsg = messages.filter(m => m.type === "ai").slice(-1)[0]
    if (lastAiMsg && lastAiMsg.showPayment) {
      router.push("/payment")
      return
    }
    addMessage(reply, "user")
    simulateAIResponse(reply)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleUploadComplete = () => {
    console.log("Upload completed") 
    handleQuickReply("Documents uploaded successfully")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-[#2850ee] hover:text-blue-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2850ee] rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">GovDocs AI Assistant</h1>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Online
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md ${
                  message.type === "user"
                    ? "bg-[#2850ee] text-white rounded-2xl rounded-br-md"
                    : "bg-white text-gray-900 rounded-2xl rounded-bl-md shadow-sm border"
                } px-4 py-3`}
              >
                <p className="whitespace-pre-line">{message.content}</p>

                {/* Quick Replies */}
                {message.quickReplies && message.type === "ai" && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.quickReplies.map((reply, index) => (
                      <Button
                        key={`${message.id}-reply-${index}`}
                        size="sm"
                        variant="outline"
                        className="text-xs bg-transparent border-gray-300 hover:bg-gray-50 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault()
                          console.log("Button clicked:", reply)
                          handleQuickReply(reply)
                        }}
                        type="button"
                      >
                        {reply}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Upload Section */}
                {message.showUpload && (
                  <div className="mt-3">
                    <DocumentUpload
                      onUploadComplete={handleUploadComplete}
                      maxFiles={3}
                      acceptedTypes={[".pdf", ".jpg", ".jpeg", ".png"]}
                    />
                  </div>
                )}

                {/* Calendar Section */}
                {message.showCalendar && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-[#2850ee]" />
                      <span className="text-sm font-medium text-[#2850ee]">Select Appointment</span>
                    </div>
                  </div>
                )}

                {/* Payment Section */}
                {message.showPayment && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-[#2850ee]" />
                      <span className="text-sm font-medium text-[#2850ee]">Payment Required</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 rounded-2xl rounded-bl-md shadow-sm border px-4 py-3">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">AI is typing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-1 h-12"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="h-12 px-6 bg-[#2850ee] hover:bg-blue-700"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

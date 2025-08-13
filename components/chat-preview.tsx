"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import Link from "next/link"

export default function ChatPreview() {
  return (
    <div className="relative">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="w-10 h-10 bg-govdocs-blue rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">GovDocs AI</div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Online
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-end">
              <div className="bg-govdocs-blue text-white rounded-2xl rounded-br-md px-4 py-2 max-w-xs">
                I lost my NIC. What do I do?
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md px-4 py-2 max-w-xs">
                Don't worry, I'm here to help you get a replacement NIC. Let's get started!
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md px-4 py-2 max-w-xs">
                Where did you lose your NIC?
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" className="text-xs bg-transparent" asChild>
              <Link href="/chat">At home</Link>
            </Button>
            <Button size="sm" variant="outline" className="text-xs bg-transparent" asChild>
              <Link href="/chat">Public place</Link>
            </Button>
            <Button size="sm" variant="outline" className="text-xs bg-transparent" asChild>
              <Link href="/chat">Not sure</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

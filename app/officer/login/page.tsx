"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function OfficerLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (username === "admin" && password === "12345678") {
      // Store simple auth state in localStorage
      localStorage.setItem(
        "officerAuth",
        JSON.stringify({
          isAuthenticated: true,
          username: "admin",
          department: "Registration Department",
          name: "Admin Officer",
        }),
      )

      console.log("[v0] Officer login successful")
      router.push("/officer/dashboard")
    } else {
      setError("Invalid credentials. Use admin / 12345678")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-govdocs-blue hover:text-blue-700 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-govdocs-blue rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-govdocs-blue">GovDocs Officer</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Officer Portal</h1>
          <p className="text-gray-600">Sign in to manage citizen applications</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">Officer Sign In</CardTitle>
            <CardDescription className="text-center">Demo: admin / 12345678</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  className="h-11"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="12345678"
                  className="h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="text-red-600 text-sm text-center">{error}</div>}

              <Button
                type="submit"
                className="w-full h-11 bg-govdocs-blue hover:bg-blue-700 text-base"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In to Officer Portal"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

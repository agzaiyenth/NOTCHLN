'use client'

import { useState } from "react"
import { registerUser, signUpWithGoogle } from "@/lib/authServices"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreeToTerms(e.target.checked)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError("Password must include at least one uppercase letter.");
      return;
    }

    if (!/[!@#$%^&*]/.test(formData.password)) {
      setError("Password must include at least one special symbol.");
      return;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Enter a valid Sri Lankan phone number.");
      return;
    }
      

    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions first.")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      await registerUser(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.phone
      )
      console.log("Account created successfully!")
      router.push("/")
    } catch (err: any) {
      console.error(err)
      if (err.message === "auth/email-already-in-use") {
        setError("Email Already Exists. Try Again with a different email.")
      } else {
        setError("Failed to create account. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      await signUpWithGoogle();
      console.log("Signed up with Google successfully!");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError("Failed to sign up with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-2">
          <Link href="/" className="inline-flex items-center gap-2 text-govdocs-blue hover:text-blue-700 mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
            <div className="flex items-center justify-center gap-2 mb-0">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="GovDocs Logo" className="w-24 h-24" />
            </div>
            </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Get started with your AI document assistant</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">Sign Up</CardTitle>
            <CardDescription className="text-center">Create an account and start today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Harsha"
                    className="h-11"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Kavinda"
                    className="h-11"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="kavinda135@gmail.com"
                  className="h-11"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(94) 75 445 5445"
                  className="h-11"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="h-11"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex items-start space-x-2">
                <Checkbox id="terms" className="mt-1" onCheckedChange={(checked) => setAgreeToTerms(!!checked)} />
                <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-govdocs-blue hover:text-blue-700">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-govdocs-blue hover:text-blue-700">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full h-11 bg-govdocs-blue hover:bg-blue-700 text-base" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="h-11 bg-transparent"
                onClick={handleGoogleSignUp}
                disabled={loading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </Button>
              <Button variant="outline" className="h-11 bg-transparent">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Button>
              <Button variant="outline" className="h-11 bg-transparent">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                </svg>
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-govdocs-blue hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

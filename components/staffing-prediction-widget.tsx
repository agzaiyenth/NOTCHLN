"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users } from "lucide-react" // Changed from BarChart3 to Users icon to match the design
import { predictStaffingNeeds } from "@/lib/staffing-prediction-service"

export function StaffingPredictionWidget() {
  const [date, setDate] = useState("")
  const [sectionId, setSectionId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePredict = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const count = await predictStaffingNeeds(date, sectionId)
      setResult(count)
    } catch (e) {
      setError("Prediction failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-md bg-white border border-gray-200 h-full">      
      <CardContent className="p-6">               
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 text-xl">Resource Allocation Planning</h2>
          </div>

          <p className="text-sm text-gray-600">
            Determine optimal staffing levels for specific dates and departments to ensure efficient service delivery.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="mm/dd/yyyy"
                className="bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department/Section</label>
              <Input
                type="text"
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                placeholder="Department ID (e.g. SEC-001)"
                className="bg-white"
              />
            </div>

            <Button
              onClick={handlePredict}
              disabled={!date || !sectionId || loading}
              className="w-full h-12 text-[16 px] bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 "
              variant="outline"
              size="lg"
            >
              <Users className="h-4 w-4 mr-2" />
              {loading ? "Generating..." : "Generate Staffing Plan"}
            </Button>

            {result !== null && (
              <Card className="border border-gray-200 bg-white shadow-sm">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <h3 className="font-semibold text-gray-900 text-[18px] ">Staffing Prediction</h3>
                    </div>

                    <p className="text-sm text-gray-600">Recommended staff allocation for your department</p>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          result <= 5
                            ? "bg-green-100 text-green-700"
                            : result <= 10
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {result} employees
                      </span>
                      <span className="text-sm text-gray-500">
                        {result <= 5 ? "Light" : result <= 10 ? "Moderate" : "Heavy"} staffing
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">
                      This is the recommended number of staff members needed to handle the expected workload for the
                      selected date and department.
                    </p>

                    <p className="text-xs text-gray-400 italic">
                      (This prediction is based on historical data and current trends)
                    </p>

                    <Button
                      onClick={handlePredict}
                      variant="outline"
                      className="w-full mt-3  text-[16px] text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent"
                      disabled={loading}
                    >
                      Refresh Prediction
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {error && <div className="text-red-600 text-center bg-red-50 p-3 rounded-lg">{error}</div>}
          </div>          
        </div>
      </CardContent>
    </Card>
  )
}

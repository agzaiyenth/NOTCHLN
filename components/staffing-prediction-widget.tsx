import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { predictStaffingNeeds } from "@/lib/staffing-prediction-service";

export function StaffingPredictionWidget() {
  const [date, setDate] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const count = await predictStaffingNeeds(date, sectionId);
      setResult(count);
    } catch (e) {
      setError("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Staffing Needs Prediction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="YYYY-MM-DD"
        />
        <Input
          type="text"
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
          placeholder="Section ID (e.g. SEC-001)"
        />
        <Button onClick={handlePredict} disabled={!date || !sectionId || loading} className="w-full">
          {loading ? "Predicting..." : "Predict"}
        </Button>
        {result !== null && (
          <div className="text-green-700 font-semibold text-center">
            Predicted Employees Needed: {result}
          </div>
        )}
        {error && <div className="text-red-600 text-center">{error}</div>}
      </CardContent>
      <CardFooter>
        <div className="text-xs text-gray-400">Powered by AI model</div>
      </CardFooter>
    </Card>
  );
}

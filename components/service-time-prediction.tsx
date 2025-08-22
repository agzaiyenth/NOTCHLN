import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { predictServiceCompletionTime } from "@/lib/prediction-service";
import { Button } from "@/components/ui/button";

interface ServiceTimePredictionProps {
  date: string;
  time: string;
  taskId: string;
  showSkeleton?: boolean;
  onRefresh?: () => void;
}

export function ServiceTimePrediction({
  date,
  time,
  taskId,
  showSkeleton = false,
  onRefresh,
}: ServiceTimePredictionProps) {
  const [loading, setLoading] = useState(true);
  const [predictedTime, setPredictedTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      if (!date || !time || !taskId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const prediction = await predictServiceCompletionTime(
          date,
          time,
          taskId
        );
        setPredictedTime(prediction);
      } catch (err) {
        console.error("Error fetching prediction:", err);
        setError("Failed to predict service time");
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [date, time, taskId]);

  // Display loading skeleton
  if (loading || showSkeleton) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardContent>
      </Card>
    );
  }

  // Display error state
  if (error || predictedTime === null) {
    return (
      <Card className="w-full border-yellow-200 bg-yellow-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
            Service Time Prediction
          </CardTitle>
          <CardDescription>
            Unable to predict service processing time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            The prediction service is temporarily unavailable. Please check with
            staff for estimated processing times.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Determine urgency level
  let urgencyColor = "green";
  let urgencyText = "Quick";

  if (predictedTime > 60) {
    urgencyColor = "red";
    urgencyText = "Long";
  } else if (predictedTime > 30) {
    urgencyColor = "yellow";
    urgencyText = "Moderate";
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center text-[18px]">
          <Clock className="mr-2 h-5 w-5 text-blue-500" />
          Service Time Prediction
        </CardTitle>
        <CardDescription>
          Estimated processing time for your service
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-3">
          <Badge
            className={`text-lg px-3 py-1 bg-${urgencyColor}-100 text-${urgencyColor}-800 border border-${urgencyColor}-200`}
          >
            {predictedTime} minutes
          </Badge>
          <Badge
            variant="outline"
            className={`ml-2 text-${urgencyColor}-700 border-${urgencyColor}-300`}
          >
            {urgencyText}
          </Badge>
        </div>
        <p className="text-sm text-gray-500">
          This is the estimated time it will take staff to process your service
          once started.
          <br />
          <span className="text-xs italic mt-1 block">
            (This does not include any waiting time before your service begins)
          </span>
        </p>
      </CardContent>
      {onRefresh && (
        <CardFooter>
          <Button
            variant="outline"
            
            onClick={onRefresh}
            className="w-full text-[16px]" 
          >
            Refresh Prediction
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

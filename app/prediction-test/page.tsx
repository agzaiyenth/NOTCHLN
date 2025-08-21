"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceTimePrediction } from "@/components/service-time-prediction";
import { StaffingPredictionWidget } from "@/components/staffing-prediction-widget";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";


// Map display names to backend task_id codes (must match tasks.csv)
const tasks = [
  { id: "TASK-001", name: "Passport Renewal" },
  { id: "TASK-002", name: "Visa Application" },
  { id: "TASK-003", name: "ID Card" },
  { id: "TASK-004", name: "Driving License" },
  { id: "TASK-005", name: "Birth Certificate" },
  { id: "TASK-006", name: "Marriage Certificate" },
  { id: "TASK-007", name: "Police Clearance" },
  { id: "TASK-008", name: "Tax Filing" },
  { id: "TASK-009", name: "Business Registration" },
  { id: "TASK-010", name: "Property Transfer" },
];

export default function PredictionTest() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("10:00");
  const [taskId, setTaskId] = useState("PASSPORT_RENEWAL");
  const [showPrediction, setShowPrediction] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePredict = () => {
    setShowPrediction(true);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Service Time & Staffing Prediction Test
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Select Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service">Service Type</Label>
                <Select value={taskId} onValueChange={setTaskId}>
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Appointment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Appointment Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={handlePredict}
                disabled={!taskId || taskId === ""}
              >
                Get Prediction
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8">
            {showPrediction ? (
              <ServiceTimePrediction
                key={refreshKey}
                date={date ? format(date, "yyyy-MM-dd") : ""}
                time={time}
                taskId={taskId}
                onRefresh={handleRefresh}
              />
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed rounded-lg p-8">
                <p className="text-center text-gray-500">
                  Enter service details and click "Get Prediction" to see the
                  estimated completion time.
                </p>
              </div>
            )}
          </div>
        </div>
        <div>
          <StaffingPredictionWidget />
        </div>
      </div>
    </div>
  );
}

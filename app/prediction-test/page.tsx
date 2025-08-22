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
import Navbar from "../Navbar";
import { BarChart3, Clock , Users} from "lucide-react";
import Footer from "../Footer";
// import { ArrowLeft, Calendar, , FileText, Users, BarChart3 } from "lucide-react"


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

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12 mt-15">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
              <BarChart3 className="h-4 w-4" />
              Smart Analytics
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 ">
              Service Processing & Resource Planning
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Optimize service delivery with intelligent processing time
              estimates and strategic staffing recommendations for government
              operations.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Service Details Card */}
            <Card className="shadow-md bg-white border border-gray-200 h-full">
              <CardHeader className="mt-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Clock className="h-5 w-5  text-blue-600" />
                  Service Processing Time Analysis
                </CardTitle>
                <p className="text-sm text-gray-600 mt-5">
                  Get accurate processing time estimates for government services
                  based on historical data and current workload patterns.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="service-type" className="text-sm font-medium">
                    Service Type
                  </Label>
                  <Select value={taskId} onValueChange={setTaskId}>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Choose a service type" />
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

                {/* appointment time  */}
                <div className="space-y-2">
                  <Label
                    htmlFor="appointment-date"
                    className="text-sm font-medium"
                  >
                    Appointment Date
                  </Label>
                  

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

                {/* Appointment time  */}
                <div className="space-y-2">
                  <Label htmlFor="appointment-time" className="text-sm font-medium">
                    Appointment Time
                  </Label>
                  <div className="relative">
                   
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                    {/* <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 text-px-4" /> */}
                    
                  </div>
                </div>

                {/* Button */}

              <Button
                className="w-full h-12 text-base font-medium"
                onClick={handlePredict}
                disabled={!taskId || taskId === ""}
                size="lg"
              >
                {/* Get Prediction */}
                {!taskId ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Analyzing...
                    </div>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Calculate Processing Time
                    </>
                  )}
              </Button>
              <div className="mt-8">
                {showPrediction && (
                <ServiceTimePrediction
                  key={refreshKey}
                  date={date ? format(date, "yyyy-MM-dd") : ""}
                  time={time}
                  taskId={taskId}
                  onRefresh={handleRefresh}
                />
                )}
              </div>
              </CardContent>
            </Card>

            {/* Staffing Prediction Card */}

            <div>
              <StaffingPredictionWidget/>
            </div>
          </div>

          <Card className="mt-8 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics Ready</h3>
                <p className="text-gray-600">
                  Select your service type and appointment details to receive data-driven processing time estimates, or
                  choose a target date and department to optimize your staffing allocation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer/>
    </div>
 );
}

  
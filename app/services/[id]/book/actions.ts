"use server"

import { promises as fs } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

// Define appointment type
export type Appointment = {
  id: string;
  userId: string;
  serviceId: string;
  date: string;
  timeSlot: string;
  officerId: string;
  locationId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
};

// Read JSON data files
async function readJsonFile(filePath: string) {
  const fullPath = path.join(process.cwd(), filePath);
  const data = await fs.readFile(fullPath, 'utf8');
  return JSON.parse(data);
}

// Write JSON data files
async function writeJsonFile(filePath: string, data: any) {
  const fullPath = path.join(process.cwd(), filePath);
  await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf8');
}

// Check if user is authenticated
function getUserId() {
  // In a real app, this would check the auth session
  // For now, we'll return a mock user ID
  return "user-123";
}

// Check if timeslot is available
export async function checkTimeSlotAvailability(date: string, timeSlot: string) {
  const appointments = await readJsonFile('data/appointments.json');
  
  // Check if there's already an appointment for this date and time
  const isBooked = appointments.some(
    (app: Appointment) => app.date === date && app.timeSlot === timeSlot && app.status !== 'cancelled'
  );
  
  return !isBooked;
}

// Create a new appointment
export async function createAppointment(
  serviceId: string,
  date: string,
  timeSlot: string,
  officerId: string,
  locationId: string,
  userEmail: string
) {
  try {
    const userId = getUserId();
    
    // Check if user is authenticated
    if (!userId) {
      return { success: false, message: "Authentication required" };
    }
    
    // Validate appointment doesn't overlap
    const isAvailable = await checkTimeSlotAvailability(date, timeSlot);
    if (!isAvailable) {
      return { success: false, message: "This time slot is no longer available" };
    }
    
    // Read existing appointments
    const appointments = await readJsonFile('data/appointments.json');
    
    // Create new appointment
    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      userId,
      serviceId,
      date,
      timeSlot,
      officerId,
      locationId,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to appointments and save
    appointments.push(newAppointment);
    await writeJsonFile('data/appointments.json', appointments);
    
    // Update time slot availability
    await updateTimeSlotAvailability(timeSlot, false);
    
    // Send confirmation email
    await sendConfirmationEmail(userEmail, newAppointment);
    
    return { 
      success: true, 
      message: "Appointment booked successfully", 
      appointmentId: newAppointment.id 
    };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return { success: false, message: "Failed to book appointment" };
  }
}

// Update time slot availability
async function updateTimeSlotAvailability(timeSlotId: string, isAvailable: boolean) {
  try {
    const timeSlots = await readJsonFile('data/timeSlots.json');
    const updatedTimeSlots = timeSlots.map((slot: any) => {
      if (slot.time === timeSlotId) {
        return { ...slot, available: isAvailable };
      }
      return slot;
    });
    await writeJsonFile('data/timeSlots.json', updatedTimeSlots);
    return true;
  } catch (error) {
    console.error("Error updating time slot:", error);
    return false;
  }
}

// Cancel an appointment
export async function cancelAppointment(appointmentId: string) {
  try {
    const userId = getUserId();
    
    // Check if user is authenticated
    if (!userId) {
      return { success: false, message: "Authentication required" };
    }
    
    // Read existing appointments
    const appointments = await readJsonFile('data/appointments.json');
    
    // Find the appointment to cancel
    const appointmentIndex = appointments.findIndex(
      (app: Appointment) => app.id === appointmentId && app.userId === userId
    );
    
    if (appointmentIndex === -1) {
      return { success: false, message: "Appointment not found" };
    }
    
    // Update appointment status
    appointments[appointmentIndex].status = 'cancelled';
    appointments[appointmentIndex].updatedAt = new Date().toISOString();
    
    // Save changes
    await writeJsonFile('data/appointments.json', appointments);
    
    // Make the time slot available again
    await updateTimeSlotAvailability(appointments[appointmentIndex].timeSlot, true);
    
    return { success: true, message: "Appointment cancelled successfully" };
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return { success: false, message: "Failed to cancel appointment" };
  }
}

// Send confirmation email
async function sendConfirmationEmail(email: string, appointment: Appointment) {
  // In a production app, you'd use a proper email service
  // For demo purposes, we'll just log the email content
  console.log(`
    To: ${email}
    Subject: Appointment Confirmation
    
    Your appointment has been confirmed:
    Date: ${appointment.date}
    Time: ${appointment.timeSlot}
    Appointment ID: ${appointment.id}
    
    Thank you for using our service.
  `);
  
  // In a real implementation, you'd use something like:
  /*
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: '"GovDocs Service" <noreply@govdocs.lk>',
    to: email,
    subject: "Your Appointment Confirmation",
    html: `
      <h1>Appointment Confirmed</h1>
      <p>Your appointment has been scheduled.</p>
      <div>
        <strong>Date:</strong> ${appointment.date}<br>
        <strong>Time:</strong> ${appointment.timeSlot}<br>
        <strong>Reference ID:</strong> ${appointment.id}
      </div>
    `,
  });
  */
}

// Get all time slots with availability for a date
export async function getTimeSlotsForDate(date: string) {
  try {
    console.log(`Fetching time slots for date: ${date}`);
    
    // Check if timeSlots.json exists
    try {
      await fs.access(path.join(process.cwd(), 'data/timeSlots.json'));
    } catch (error) {
      console.error("timeSlots.json doesn't exist:", error);
      // Create default time slots if file doesn't exist
      const defaultTimeSlots = [
        { "id": "1", "time": "9:00 AM", "available": true },
        { "id": "2", "time": "9:30 AM", "available": true },
        { "id": "3", "time": "10:00 AM", "available": true },
        { "id": "4", "time": "10:30 AM", "available": true }
      ];
      await writeJsonFile('data/timeSlots.json', defaultTimeSlots);
      return defaultTimeSlots;
    }
    
    // Get base time slots
    const timeSlots = await readJsonFile('data/timeSlots.json');
    console.log(`Found ${timeSlots.length} base time slots`);
    
    // Check if appointments.json exists
    try {
      await fs.access(path.join(process.cwd(), 'data/appointments.json'));
    } catch (error) {
      console.error("appointments.json doesn't exist:", error);
      await writeJsonFile('data/appointments.json', []);
      return timeSlots;
    }
    
    // Get appointments for the selected date
    const appointments = await readJsonFile('data/appointments.json');
    console.log(`Found ${appointments.length} appointments in total`);
    
    const bookedSlots = appointments
      .filter((app: Appointment) => app.date === date && app.status !== 'cancelled')
      .map((app: Appointment) => app.timeSlot);
    
    console.log(`Found ${bookedSlots.length} booked slots for selected date`);
    
    // Update availability based on bookings
    const availableTimeSlots = timeSlots.map((slot: any) => ({
      ...slot,
      available: slot.available && !bookedSlots.includes(slot.time)
    }));
    
    return availableTimeSlots;
  } catch (error) {
    console.error("Error fetching time slots:", error);
    // Return default slots as fallback
    return [
      { "id": "1", "time": "9:00 AM", "available": true },
      { "id": "2", "time": "9:30 AM", "available": true },
      { "id": "3", "time": "10:00 AM", "available": true },
      { "id": "4", "time": "10:30 AM", "available": true }
    ];
  }
}

// Get all officers with availability
export async function getAvailableOfficers() {
  try {
    const officers = await readJsonFile('data/officers.json');
    return officers;
  } catch (error) {
    console.error("Error fetching officers:", error);
    return [];
  }
}

// Get all locations
export async function getAvailableLocations() {
  try {
    const locations = await readJsonFile('data/locations.json');
    return locations;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}
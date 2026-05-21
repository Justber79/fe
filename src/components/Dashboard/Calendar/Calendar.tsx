"use client";
import { DashboardLayout } from "@/components/Layout";
import { CalendarContent } from "./CalendarContent";

export function DashboardCalendar() {
  return (
    <DashboardLayout>
      <CalendarContent />
    </DashboardLayout>
  );
}

export default DashboardCalendar;

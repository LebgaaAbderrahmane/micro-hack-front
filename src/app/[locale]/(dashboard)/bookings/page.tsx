"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import OperatorBookings from "@/components/dashboard/OperatorBookings";
import CarrierBookingPage from "@/components/carriar/CarrierBooking";

export default function BookingsPage() {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const role = profile?.role?.toUpperCase();

  if (role === "DISPATCHER") {
    return <CarrierBookingPage />;
  }

  return <OperatorBookings />;
}

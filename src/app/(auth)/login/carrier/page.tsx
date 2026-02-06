"use client";

import { RoleLoginPage } from "../RoleLoginPage";
import { Truck } from "lucide-react";

export default function CarrierLoginPage() {
  return (
    <RoleLoginPage
      role="DISPATCHER"
      roleTitle="Carrier Portal"
      description="Fleet sync & slot reservation"
      icon={Truck}
      themeColor="bg-accent shadow-accent/20"
    />
  );
}

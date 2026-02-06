"use client";

import { RoleLoginPage } from "../RoleLoginPage";
import { Shield } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <RoleLoginPage
      role="ADMIN"
      roleTitle="Port Admin"
      description="System-level node orchestration"
      icon={Shield}
      themeColor="bg-error shadow-error/20"
    />
  );
}

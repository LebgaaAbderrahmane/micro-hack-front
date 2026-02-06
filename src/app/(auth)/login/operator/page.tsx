"use client";

import { RoleLoginPage } from "../RoleLoginPage";
import { Ship } from "lucide-react";

export default function OperatorLoginPage() {
  return (
    <RoleLoginPage
      role="OPERATOR"
      roleTitle="Terminal Op"
      description="Yard & berth management"
      icon={Ship}
      themeColor="bg-secondary shadow-secondary/20"
    />
  );
}

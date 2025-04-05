
import React from "react";
import { AccountsLayout } from "@/components/layout/AccountsLayout";

export default function Accounts() {
  return (
    <AccountsLayout activeTab="clients">
      {/* Children content will be rendered by the AccountsLayout component */}
    </AccountsLayout>
  );
}

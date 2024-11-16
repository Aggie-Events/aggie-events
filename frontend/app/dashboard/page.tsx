"use client";
import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import AuthSuspense from "@/components/auth/AuthSuspense";

export default function Database() {
  return (
    <>
      <AuthSuspense>
        <Dashboard />
      </AuthSuspense>
    </>
  );
}

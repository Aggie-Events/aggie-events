"use client"
import React, { useEffect, useState } from "react";
import AddUserForm from "./AddUserForm";
import AuthRedirect from '@/components/auth/AuthRedirect'

export default function Database() {
  return (
    <>
      <AuthRedirect url={'/login'}/>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <AddUserForm />
    </>
  );
}
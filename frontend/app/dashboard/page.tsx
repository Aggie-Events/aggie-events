"use client"
import React, { useEffect, useState } from "react";
import AddUserForm from "./AddUserForm";
import UserList from "./UserList";

export default function Database() {
  return (
    <>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <AddUserForm />
    </>
  );
}
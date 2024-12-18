"use client"
import React from "react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";

export default function Home() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
            <QueryClientProvider client={new QueryClient()}>
                <DashboardLayout/>
            </QueryClientProvider>
        </LocalizationProvider>
    );
}

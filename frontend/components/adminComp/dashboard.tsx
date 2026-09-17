"use client";
import React from "react";
import { Users, Building2, Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DashboardProps {
  users: any[];
  stores: any[];
}

export default function dashboard({ users, stores }: DashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Platform Analytics Dashboard</h2>
        <p className="text-sm text-slate-500">Overview of key system statistics and metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
            <Users className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
            <p className="text-xs text-slate-400 mt-1">Registered Admins, Normal Users & Store Owners</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Stores</CardTitle>
            <Building2 className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stores.length}</div>
            <p className="text-xs text-slate-400 mt-1">Active registered stores on platform</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Ratings Submitted</CardTitle>
            <Star className="h-5 w-5 text-amber-500 fill-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
            <p className="text-xs text-slate-400 mt-1">Total customer reviews recorded</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}







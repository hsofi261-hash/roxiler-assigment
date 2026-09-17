"use client";
import React, { useState } from "react";
import { LayoutDashboard, Users as UsersIcon, Store as StoreIcon, LogOut, Shield, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

import Dashboard  from "@/components/adminComp/dashboard";
import UsersManagement  from "@/components/adminComp/users";
import StoreManagement  from "@/components/adminComp/stores";

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [successMsg, setSuccessMsg] = useState("");

  const [users, setUsers] = useState([
    { id: 1, name: "Alexander Hamilton System Admin", email: "admin@platform.com", address: "1 Admin Plaza, NY", role: "System Administrator", rating: null },
    { id: 2, name: "Benjamin Franklin Normal User", email: "ben@example.com", address: "45 Independence St, Philadelphia", role: "Normal User", rating: null },
    { id: 3, name: "Charles Darwin Store Owner Elite", email: "charles@storeowner.com", address: "88 Evolution Road, London", role: "Store Owner", rating: 4.8 },
    { id: 4, name: "Diana Prince Marketplace Consumer", email: "diana@themyscira.gov", address: "52 Amazon Highway,DC", role: "Normal User", rating: null },
  ]);

  const [stores, setStores] = useState([
    { id: 1, name: "Downtown Electronics Store", email: "contact@downtownelectronics.com", address: "123 Market Street, Suite 100", rating: 4.2 },
    { id: 2, name: "Green Valley Organic Grocers", email: "support@greenvalley.com", address: "456 Eco Avenue", rating: 4.8 },
    { id: 3, name: "Urban Bookstore & Cafe", email: "hello@urbanbooks.org", address: "789 Read Lane", rating: 3.9 },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-indigo-600" />
          <h1 className="text-xl font-bold tracking-tight">System Administrator Portal</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-slate-600">Admin: System Control</span>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" /> Log Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {successMsg && (
          <Alert className="mb-6 bg-emerald-50 text-emerald-900 border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertDescription>{successMsg}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1 rounded-xl shadow-sm grid grid-cols-3 max-w-lg">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="stores" className="flex items-center gap-2">
              <StoreIcon className="h-4 w-4" /> Stores
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard users={users} stores={stores} />
          </TabsContent>

          <TabsContent value="users">
            <UsersManagement users={users} setUsers={setUsers} setSuccessMsg={setSuccessMsg} />
          </TabsContent>

          <TabsContent value="stores">
            <StoreManagement stores={stores} setStores={setStores} setSuccessMsg={setSuccessMsg} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users as UsersIcon, Store as StoreIcon, LogOut, Shield, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

import Dashboard from "@/components/adminComp/dashboard";
import UsersManagement from "@/components/adminComp/users";
import StoreManagement from "@/components/adminComp/stores";

// Import auth, dashboard stats, user, and store API hooks
import { useCheckAdminAuthQuery } from "@/lib/api/authApi";
import { useGetAdminDashboardStatsQuery } from "@/lib/api/dashboardApi";
import { useGetUsersQuery } from "@/lib/api/userApi";
import { useGetStoresQuery } from "@/lib/api/storeApi";

export default function AdminPortalPage() {
  const router = useRouter();

  // Check if token exists in localStorage to avoid premature queries
  const hasToken = typeof window !== "undefined" && Boolean(localStorage.getItem("token"));

  // 1. Verify admin permissions on load
  const { data: authData, isLoading: isAuthLoading, isError } = useCheckAdminAuthQuery(undefined, {
    skip: !hasToken,
  });

  // Redirect to homepage if unauthenticated, token is missing, or user lacks admin access
  useEffect(() => {
    if (!hasToken || isError || (authData && !authData.isAuthenticated)) {
      router.push("/");
    }
  }, [hasToken, isError, authData, router]);

  // 2. Fetch live database counts via dashboard API (totalUsers, totalStores, totalRatings)
  const { data: statsData } = useGetAdminDashboardStatsQuery(undefined, {
    skip: !hasToken || (authData && !authData.isAuthenticated),
  });

  // 3. Fetch live users directory via RTK Query
  const { data: usersData, refetch: refetchUsers } = useGetUsersQuery(undefined, {
    skip: !hasToken || (authData && !authData.isAuthenticated),
  });

  // 4. Fetch live stores directory via RTK Query
  const { data: storesData, refetch: refetchStores } = useGetStoresQuery(undefined, {
    skip: !hasToken || (authData && !authData.isAuthenticated),
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [successMsg, setSuccessMsg] = useState("");

  // Transform backend user models to match child component expectations
  const users = usersData?.users ? usersData.users.map((u: any) => {
    const storeWithRatings = u.stores?.[0];
    const ratingsList = storeWithRatings?.ratings || [];
    const avgRating = ratingsList.length > 0 
      ? Number((ratingsList.reduce((acc: number, curr: any) => acc + curr.rating, 0) / ratingsList.length).toFixed(1))
      : null;

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      address: u.address,
      role: u.role,
      rating: avgRating,
    };
  }) : [];

  // Transform backend store models to match child component expectations
  const stores = storesData?.stores ? storesData.stores.map((s: any) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    address: s.address,
    rating: s.averageRating ?? 0,
  })) : [];

  // Wrapper setters for management components to safely trigger refetches on updates
  const handleSetUsers = () => {
    refetchUsers();
  };

  const handleSetStores = () => {
    refetchStores();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // Show loading indicator while verifying admin privileges
  if (isAuthLoading || !hasToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium">Verifying administrator access...</p>
      </div>
    );
  }

  // Prevent rendering if unauthorized while redirect is pending
  if (isError || (authData && !authData.isAuthenticated)) {
    return null;
  }

  // Use the exact database counts returned from the getAdminDashboardStats backend controller
  const stats = statsData?.stats || {
    totalUsers: users.length,
    totalStores: stores.length,
    totalRatings: 0,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-indigo-600" />
          <h1 className="text-xl font-bold tracking-tight">System Administrator Portal</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-slate-600">
            Admin: {authData?.user?.name || "System Control"}
          </span>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleLogout}>
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
            <Dashboard users={users} stores={stores} stats={stats} />
          </TabsContent>

          <TabsContent value="users">
            <UsersManagement users={users} setUsers={handleSetUsers} setSuccessMsg={setSuccessMsg} />
          </TabsContent>

          <TabsContent value="stores">
            <StoreManagement stores={stores} setStores={handleSetStores} setSuccessMsg={setSuccessMsg} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
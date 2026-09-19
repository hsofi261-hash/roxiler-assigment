"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Users, Building2, Search, Mail, ArrowUpDown, MessageSquare, Lock, PlusCircle, Store as StoreIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Import API hooks from your RTK Query slices
import { useGetStoreOwnerDashboardQuery } from "@/lib/api/dashboardApi"; // Adjust import path as needed
import { useCreateStoreMutation } from "@/lib/api/storeApi";           // Adjust import path as needed
import { useCheckStoreAuthQuery } from "@/lib/api/authApi";

export default function StoreOwnerDashboardPage() {
  const router = useRouter();

  // Check token presence
  const hasToken = typeof window !== "undefined" && Boolean(localStorage.getItem("token"));

  // 1. Auth check
  const { data: authData, isLoading: isAuthLoading, isError: isAuthError } = useCheckStoreAuthQuery(undefined, {
    skip: !hasToken,
  });

  // 2. Fetch Store Owner Dashboard Data
  const { 
    data: dashboardData, 
    isLoading: isDashboardLoading, 
    refetch: refetchDashboard 
  } = useGetStoreOwnerDashboardQuery(undefined, {
    skip: !hasToken || !authData?.isAuthenticated,
  });

  // 3. Create Store Mutation
  const [createStore, { isLoading: isCreatingStore }] = useCreateStoreMutation();

  // Store Creation Form State
  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Table & Filtering state for ratings
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("rating");
  const [sortAsc, setSortAsc] = useState(false);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!hasToken || isAuthError || (authData && !authData.isAuthenticated)) {
      router.push("/");
    }
  }, [hasToken, isAuthError, authData, router]);

  // Handle Store Creation Form Submission
  const handleCreateStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    // Frontend validations matching backend rules
    if (!storeForm.name || storeForm.name.length < 20 || storeForm.name.length > 60) {
      setFormError("Store name must be between 20 and 60 characters.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!storeForm.email || !emailRegex.test(storeForm.email)) {
      setFormError("Please enter a valid store email format.");
      return;
    }

    if (!storeForm.address || storeForm.address.length > 400) {
      setFormError("Store address cannot exceed 400 characters.");
      return;
    }

    try {
      await createStore({
        name: storeForm.name,
        email: storeForm.email,
        address: storeForm.address,
      }).unwrap();

      setFormSuccess("Store created successfully!");
      setStoreForm({ name: "", email: "", address: "" });
      // Refetch dashboard data to load the newly created store
      refetchDashboard();
    } catch (err: any) {
      setFormError(err?.data?.message || "Failed to create store. Please try again.");
    }
  };

  // Loading state
  if (isAuthLoading || isDashboardLoading || !hasToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium">Loading store dashboard...</p>
      </div>
    );
  }

  if (isAuthError || (authData && !authData.isAuthenticated)) {
    return null;
  }

  const stores = dashboardData?.stores || [];
  const hasStore = stores.length > 0;
  // For single-store owners (or picking the first store)
  const currentStore = hasStore ? stores[0] : null;

  // --- CONDITIONAL RENDERING: IF STORE IS NOT PRESENT, SHOW CREATION FORM ---
  if (!hasStore) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="space-y-1 text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-2">
              <StoreIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Setup Your Store</CardTitle>
            <p className="text-sm text-slate-500">
              You haven't created a store yet. Fill out the details below to initialize your store dashboard and start receiving customer reviews.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateStoreSubmit} className="space-y-5">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm rounded-lg">
                  {formSuccess}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Store Name</label>
                <Input
                  placeholder="e.g., Downtown Electronics & Gadgets Store (20-60 chars)"
                  value={storeForm.name}
                  onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                  required
                />
                <p className="text-xs text-slate-400">Must be between 20 and 60 characters.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Store Business Email</label>
                <Input
                  type="email"
                  placeholder="contact@downtownelectronics.com"
                  value={storeForm.email}
                  onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Store Address</label>
                <textarea
                  className="w-full min-h-[100px] p-3 text-sm rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="123 Market Street, Suite 100, City..."
                  value={storeForm.address}
                  onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                  required
                />
                <p className="text-xs text-slate-400">Maximum 400 characters.</p>
              </div>

              <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isCreatingStore}>
                <PlusCircle className="h-4 w-4" />
                {isCreatingStore ? "Creating Store..." : "Create Store & Open Dashboard"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- RENDER STORE OWNER DASHBOARD IF STORE EXISTS ---
  const ratingsList = currentStore?.ratedByUsers || [];

  const handleSort = (field: string) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredRatings = ratingsList.filter(item => 
    item.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.user?.email.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    let valA = sortField === "userName" ? a.user?.name : sortField === "email" ? a.user?.email : a.rating;
    let valB = sortField === "userName" ? b.user?.name : sortField === "email" ? b.user?.email : b.rating;
    if ((valA || "") < (valB || "")) return sortAsc ? -1 : 1;
    if ((valA || "") > (valB || "")) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Store Owner Dashboard</h2>
          <p className="text-sm text-slate-500">Monitor your store's performance, customer feedback, and ratings breakdown.</p>
        </div>
        <Link href="/store/updatepassword">
          <Button variant="outline" className="flex items-center gap-2 shadow-sm">
            <Lock className="h-4 w-4 text-slate-500" />
            Update Password
          </Button>
        </Link>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Store Average Rating</CardTitle>
            <Star className="h-5 w-5 text-amber-500 fill-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              {currentStore.averageRating} <span className="text-sm font-normal text-slate-400">/ 5.0</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Based on verified customer reviews</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Ratings Received</CardTitle>
            <Users className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentStore.totalRatings}</div>
            <p className="text-xs text-slate-400 mt-1">Accumulated feedback count</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Store Status</CardTitle>
            <Building2 className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Online & Active</div>
            <p className="text-xs text-slate-400 mt-1">{currentStore.name}</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Ratings Section */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Customer Feedback & User Ratings</h3>
            <p className="text-xs text-slate-500">Detailed list of platform users who have submitted reviews for your store.</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by customer name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Ratings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort("userName")}>
                    <div className="flex items-center gap-1">Customer Name <ArrowUpDown className="h-3.5 w-3.5" /></div>
                  </th>
                  <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort("email")}>
                    <div className="flex items-center gap-1">Email <ArrowUpDown className="h-3.5 w-3.5" /></div>
                  </th>
                  <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort("rating")}>
                    <div className="flex items-center gap-1">Rating <ArrowUpDown className="h-3.5 w-3.5" /></div>
                  </th>
                  <th className="p-4">Customer Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRatings.map((item) => (
                  <tr key={item.ratingId} className="hover:bg-slate-50/50">
                    <td className="p-4 font-medium text-slate-900">{item.user?.name || "N/A"}</td>
                    <td className="p-4 text-slate-600 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" /> {item.user?.email || "N/A"}
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="flex items-center gap-1 font-semibold w-fit text-amber-700 bg-amber-50 border-amber-200">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" /> {item.rating} / 5
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-700 max-w-xs truncate">
                      {item.user?.address || "N/A"}
                    </td>
                  </tr>
                ))}
                {filteredRatings.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 italic">
                      No ratings or customer reviews found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
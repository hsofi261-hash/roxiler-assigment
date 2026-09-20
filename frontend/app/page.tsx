"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Star, Store, LogOut, LogIn } from "lucide-react";

// Import RTK Query hooks
import { useCheckAuthQuery } from "@/lib/api/authApi";
import { useGetStoresQuery } from "@/lib/api/storeApi";

// Mock shadcn-style UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StoreCatalogPage() {
  const router = useRouter();

  // Check if a token exists in localStorage to avoid unnecessary queries if unauthenticated
  const hasToken = typeof window !== "undefined" && Boolean(localStorage.getItem("token"));

  // RTK Query hook to check authorization and fetch user details from backend
  const { data: authData, isLoading: isAuthLoading } = useCheckAuthQuery(undefined, {
    skip: !hasToken,
  });

  const isLoggedIn = Boolean(hasToken && authData?.isAuthenticated && authData?.user);
  const userName = authData?.user?.name || "User";

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [addressQuery, setAddressQuery] = useState("");

  // Fetch stores from API using RTK Query (empty strings are handled cleanly)
  const { data: storesResponse, isLoading: isStoresLoading, error: storesError } = useGetStoresQuery({
    search: searchQuery || undefined,
    address: addressQuery || undefined,
  });

  const stores = storesResponse?.stores || [];

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-2">
          <Store className="h-6 w-6 text-indigo-600" />
          <h1 className="text-xl font-bold tracking-tight">Store Rating Platform</h1>
        </div>
        <div className="flex items-center space-x-4">
          {isAuthLoading ? (
            <span className="text-sm text-slate-400">Loading...</span>
          ) : isLoggedIn ? (
            <>
              <span className="text-sm font-medium text-slate-600">Welcome, {userName}</span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" /> Log Out
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => router.push("/auth")} className="flex items-center gap-2">
              <LogIn className="h-4 w-4" /> Log In
            </Button>
          )}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Page Title & Description */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Registered Stores Catalog</h2>
          <p className="text-sm text-slate-500">Browse stores and check overall ratings.</p>
        </div>

        {/* Search Bar Grid */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search store by Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search store by Address..."
              value={addressQuery}
              onChange={(e) => setAddressQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Loading and Error States */}
        {isStoresLoading && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500">Loading stores...</p>
          </div>
        )}

        {storesError && (
          <div className="text-center py-12 bg-white rounded-xl border border-rose-200 shadow-sm">
            <p className="text-rose-500">Failed to load stores. Please try again later.</p>
          </div>
        )}

        {/* Store Grid */}
        {!isStoresLoading && !storesError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <Card key={store.id} className="flex flex-col justify-between border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white" onClick={() => router.push(`/store/${store.id}`)}>
                <CardHeader className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg font-semibold leading-snug flex-1 min-w-0 break-words">
                      {store.name}
                    </CardTitle>
                    <Badge variant="secondary" className="flex items-center gap-1 font-semibold shrink-0">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                      {store.averageRating ?? 0}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1.5 text-slate-500 min-w-0">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="truncate">{store.address}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-2">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">Total Ratings:</span>
                    <span className="font-bold text-indigo-600">
                      {store.totalRatings ?? 0} reviews
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isStoresLoading && !storesError && stores.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500">No stores found matching your search criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}
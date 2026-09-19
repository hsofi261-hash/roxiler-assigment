"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Star, Store, LogOut, Edit3, PlusCircle, LogIn } from "lucide-react";

// Import the RTK Query hook (adjust path based on where your authApi file is saved)
import { useCheckAuthQuery } from "@/lib/api/authApi";

// Mock shadcn-style UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Define TypeScript Interface for Store
interface StoreType {
  id: number;
  name: string;
  email: string;
  address: string;
  overallRating: number;
  userRating: number | null;
}

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
  
  // Rating Modal State
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [activeStore, setActiveStore] = useState<StoreType | null>(null);
  const [selectedRating, setSelectedRating] = useState(5);

  // Mock Data with StoreType[]
  const [stores, setStores] = useState<StoreType[]>([
    {
      id: 1,
      name: "Downtown Electronics Store",
      email: "contact@downtownelectronics.com",
      address: "123 Market Street, Suite 100",
      overallRating: 4.2,
      userRating: 4,
    },
    {
      id: 2,
      name: "Green Valley Organic Grocers",
      email: "support@greenvalley.com",
      address: "456 Eco Avenue",
      overallRating: 4.8,
      userRating: null,
    },
    {
      id: 3,
      name: "Urban Bookstore & Cafe",
      email: "hello@urbanbooks.org",
      address: "789 Read Lane",
      overallRating: 3.9,
      userRating: 5,
    },
  ]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth"; // Full reload or router.push to clear RTK query cache state
  };

  // Filter stores by Name and Address
  const filteredStores = stores.filter((store) => {
    const matchesName = store.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAddress = store.address.toLowerCase().includes(addressQuery.toLowerCase());
    return matchesName && matchesAddress;
  });

  // Handle Rating Click (Redirect to login if unauthenticated or token is invalid)
  const handleOpenRatingModal = (store: StoreType) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token || !isLoggedIn) {
      router.push("/auth");
      return;
    }

    setActiveStore(store);
    setSelectedRating(store.userRating || 5);
    setIsRatingOpen(true);
  };

  const handleSaveRating = () => {
    if (!activeStore) return;
    
    setStores(stores.map(s => {
      if (s.id === activeStore.id) {
        return { ...s, userRating: selectedRating };
      }
      return s;
    }));
    setIsRatingOpen(false);
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
          <p className="text-sm text-slate-500">Browse stores, check overall ratings, and submit or update your reviews.</p>
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

        {/* Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <Card key={store.id} className="flex flex-col justify-between border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold">{store.name}</CardTitle>
                  <Badge variant="secondary" className="flex items-center gap-1 font-semibold">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                    {store.overallRating}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1 text-slate-500 pt-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{store.address}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center text-sm">
                  <span className="text-slate-600">Your Submitted Rating:</span>
                  {store.userRating ? (
                    <span className="font-bold text-indigo-600 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-indigo-600" /> {store.userRating} / 5
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">Not rated yet</span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button 
                  onClick={() => handleOpenRatingModal(store)} 
                  className="w-full flex items-center justify-center gap-2"
                  variant={store.userRating ? "outline" : "default"}
                >
                  {store.userRating ? (
                    <>
                      <Edit3 className="h-4 w-4" /> Modify Rating
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4" /> Submit Rating
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500">No stores found matching your search criteria.</p>
          </div>
        )}
      </main>

      {/* Rating Management Component (Modal / Dialog) */}
      <Dialog open={isRatingOpen} onOpenChange={setIsRatingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {activeStore?.userRating ? "Modify Your Rating" : "Submit Rating"}
            </DialogTitle>
            <p className="text-sm text-slate-500 pt-1">
              Rate <span className="font-semibold text-slate-800">{activeStore?.name}</span> on a scale from 1 to 5.
            </p>
          </DialogHeader>

          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRating(star)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= selectedRating
                        ? "fill-amber-400 text-amber-500"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-sm font-medium text-slate-700">
              Selected Score: <span className="text-lg font-bold text-indigo-600">{selectedRating} / 5</span>
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsRatingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRating}>
              Save Rating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
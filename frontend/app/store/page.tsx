"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Users, Building2, Search, Mail, ArrowUpDown, MessageSquare, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Import the store auth check hook from your authApi slice
import { useCheckStoreAuthQuery } from "@/lib/api/authApi";

export default function Page() {
  const router = useRouter();

  // Check if token exists in localStorage to avoid premature queries
  const hasToken = typeof window !== "undefined" && Boolean(localStorage.getItem("token"));

  // Query store owner auth endpoint
  const { data: authData, isLoading, isError } = useCheckStoreAuthQuery(undefined, {
    skip: !hasToken,
  });

  // Redirect to homepage if unauthenticated, token is missing, or user lacks store access
  useEffect(() => {
    if (!hasToken || isError || (authData && !authData.isAuthenticated)) {
      router.push("/");
    }
  }, [hasToken, isError, authData, router]);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortAsc, setSortAsc] = useState(false);

  // Mock Store Details & Customer Ratings
  const storeDetails = {
    name: "Downtown Electronics Store",
    email: "contact@downtownelectronics.com",
    address: "123 Market Street, Suite 100",
    averageRating: 4.6,
    totalRatingsCount: 14,
  };

  const [ratingsList, setRatingsList] = useState([
    { id: 1, userName: "Benjamin Franklin Normal User", email: "ben@example.com", rating: 5, comment: "Exceptional customer service and extremely fast shipping!", date: "2026-06-12" },
    { id: 2, userName: "Diana Prince Marketplace Consumer", email: "diana@themyscira.gov", rating: 4, comment: "Good selection of gadgets, staff was helpful.", date: "2026-06-10" },
    { id: 3, userName: "Thomas Jefferson", email: "thomas@jefferson.org", rating: 5, comment: "Exceeded expectations. Will definitely shop here again.", date: "2026-06-05" },
    { id: 4, userName: "Abigail Adams", email: "abigail@adams.net", rating: 4, comment: "Fair pricing, neat storefront presentation.", date: "2026-05-28" },
  ]);

  const handleSort = (field: string) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredRatings = ratingsList.filter(item => 
    item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.comment.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    let valA = a[sortField as keyof typeof a] || "";
    let valB = b[sortField as keyof typeof b] || "";
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  // Show loading indicator while verifying permissions
  if (isLoading || !hasToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium">Verifying store owner access...</p>
      </div>
    );
  }

  // Prevent rendering dashboard content if unauthorized while redirect is pending
  if (isError || (authData && !authData.isAuthenticated)) {
    return null;
  }

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
              {storeDetails.averageRating} <span className="text-sm font-normal text-slate-400">/ 5.0</span>
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
            <div className="text-3xl font-bold">{storeDetails.totalRatingsCount}</div>
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
            <p className="text-xs text-slate-400 mt-1">{storeDetails.name}</p>
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
              placeholder="Search by user name, email, or review comments..."
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
                  <th className="p-4">Comments / Feedback</th>
                  <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort("date")}>
                    <div className="flex items-center gap-1">Date <ArrowUpDown className="h-3.5 w-3.5" /></div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRatings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-medium text-slate-900">{item.userName}</td>
                    <td className="p-4 text-slate-600 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" /> {item.email}
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="flex items-center gap-1 font-semibold w-fit text-amber-700 bg-amber-50 border-amber-200">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" /> {item.rating} / 5
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-700 max-w-xs truncate">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {item.comment}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-xs">{item.date}</td>
                  </tr>
                ))}
                {filteredRatings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                      No matching ratings found.
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
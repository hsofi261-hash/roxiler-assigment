"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Store, 
  MapPin, 
  Star, 
  Mail, 
  User as UserIcon, 
  ShieldAlert, 
  Loader2, 
  MessageSquare,
  PlusCircle,
  Edit3
} from "lucide-react";

// Import RTK Query hooks
import { useGetStoreByIdQuery } from "@/lib/api/storeApi";
import { useCheckAuthQuery } from "@/lib/api/authApi";
import { useSubmitRatingMutation, useUpdateRatingMutation } from "@/lib/api/ratingApi";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function StoreDetailPage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params?.id as string;

  // Check if a token exists in localStorage
  const hasToken = typeof window !== "undefined" && Boolean(localStorage.getItem("token"));

  // Fetch authorization data to get current user ID
  const { data: authData } = useCheckAuthQuery(undefined, {
    skip: !hasToken,
  });

  const isLoggedIn = Boolean(hasToken && authData?.isAuthenticated && authData?.user);
  const currentUserId = authData?.user?.id;

  // Fetch store details by ID using RTK Query
  const { data: response, isLoading, error } = useGetStoreByIdQuery(storeId, {
    skip: !storeId,
  });

  const store = response?.store;

  // Rating Modal & Mutation States
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);

  const [submitRating, { isLoading: isSubmitting }] = useSubmitRatingMutation();
  const [updateRating, { isLoading: isUpdating }] = useUpdateRatingMutation();

  // Check if the current logged-in user has already rated this store
  const userExistingRating = store?.ratings?.find(
    (review: any) => review.userId === currentUserId || review.user?.id === currentUserId
  );

  // Handle opening rating modal (checks auth first)
  const handleOpenRatingModal = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token || !isLoggedIn) {
      router.push("/auth");
      return;
    }

    // Pre-fill with existing rating if available, otherwise default to 5
    setSelectedRating(userExistingRating ? userExistingRating.rating : 5);
    setIsRatingOpen(true);
  };

  // Handle saving rating (Submit or Update)
  const handleSaveRating = async () => {
    try {
      if (userExistingRating) {
        await updateRating({ id: userExistingRating.id, rating: selectedRating }).unwrap();
      } else {
        await submitRating({ storeId, rating: selectedRating }).unwrap();
      }
      
      // Close modal on successful submission/update
      setIsRatingOpen(false);
    } catch (err) {
      console.error("Failed to save rating:", err);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
        <p className="text-sm text-slate-500 font-medium">Loading store details...</p>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center max-w-md w-full">
          <ShieldAlert className="h-10 w-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-1">Store Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">
            The store you are looking for doesn't exist or could not be loaded.
          </p>
          <Button onClick={() => router.push("/")} className="w-full flex items-center justify-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Catalog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header / Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex items-center space-x-2">
          <Store className="h-5 w-5 text-indigo-600" />
          <span className="font-semibold text-slate-800">Store Profile</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Store Header Overview Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {store.name}
              </h1>
              <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1 text-base font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                {store.averageRating ?? 0} <span className="text-xs text-slate-500 font-normal">/ 5</span>
              </Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-slate-500 pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{store.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{store.email}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl min-w-[150px] text-center w-full md:w-auto">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Reviews</p>
              <p className="text-2xl font-extrabold text-indigo-600 mt-0.5">{store.totalRatings ?? 0}</p>
            </div>

            {/* Submit / Modify Rating Button */}
            <Button 
              onClick={handleOpenRatingModal} 
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-6"
              variant={userExistingRating ? "outline" : "default"}
            >
              {userExistingRating ? (
                <>
                  <Edit3 className="h-4 w-4" /> Modify Rating ({userExistingRating.rating}★)
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" /> Submit Rating
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Owner Information Section (if available) */}
        {store.owner && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
                <UserIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Store Owner</p>
                <p className="text-sm font-semibold text-slate-800">{store.owner.name}</p>
              </div>
            </div>
            <div className="text-sm text-slate-500 hidden sm:flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{store.owner.email}</span>
            </div>
          </div>
        )}

        {/* Ratings and Reviews Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-indigo-600" /> User Ratings & Reviews
            </h2>
          </div>

          {store.ratings && store.ratings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {store.ratings.map((review: any) => (
                <Card key={review.id} className="border-slate-200 shadow-sm bg-white flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2.5">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold">
                          {review.user?.name ? review.user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <CardTitle className="text-sm font-semibold text-slate-800">
                            {review.user?.name || "Anonymous User"}
                          </CardTitle>
                          <CardDescription className="text-xs text-slate-400">
                            {review.user?.email || "No email provided"}
                          </CardDescription>
                        </div>
                      </div>
                      
                      {/* Individual Star Score Badge */}
                      <Badge variant="outline" className="flex items-center gap-1 font-bold text-amber-600 border-amber-200 bg-amber-50/50">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                        {review.rating} / 5
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 pb-4">
                    <div className="flex space-x-1 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "fill-amber-400 text-amber-500"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
              <Star className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-700">No ratings yet</h3>
              <p className="text-sm text-slate-400 mt-1">This store hasn't received any reviews yet.</p>
            </div>
          )}
        </div>

      </main>

      {/* Rating Management Component (Modal / Dialog) */}
      <Dialog open={isRatingOpen} onOpenChange={setIsRatingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {userExistingRating ? "Modify Your Rating" : "Submit Rating"}
            </DialogTitle>
            <p className="text-sm text-slate-500 pt-1">
              Rate <span className="font-semibold text-slate-800">{store.name}</span> on a scale from 1 to 5.
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
            <Button onClick={handleSaveRating} disabled={isSubmitting || isUpdating}>
              {isSubmitting || isUpdating ? "Saving..." : "Save Rating"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
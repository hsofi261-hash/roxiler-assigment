"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import the store auth check and update password mutation hooks from your authApi slice
// (Adjust path if your api slice is located elsewhere, e.g., "@/lib/api/authApi")
import { useCheckStoreAuthQuery, useUpdatePasswordMutation } from "@/lib/api/authApi";

export default function Page() {
  const router = useRouter();

  // Check if token exists in localStorage to avoid unnecessary queries
  const hasToken = typeof window !== "undefined" && Boolean(localStorage.getItem("token"));

  // Query store owner auth endpoint
  const { data: authData, isLoading: isAuthLoading, isError } = useCheckStoreAuthQuery(undefined, {
    skip: !hasToken,
  });

  // Redirect to homepage if unauthenticated, token is missing, or user lacks store access
  useEffect(() => {
    if (!hasToken || isError || (authData && !authData.isAuthenticated)) {
      router.push("/");
    }
  }, [hasToken, isError, authData, router]);

  // RTK Query update password mutation hook
  const [updatePassword, { isLoading: isUpdating }] = useUpdatePasswordMutation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const validatePassword = (password: string) => 
    /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/.test(password);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!currentPassword) {
      setErrorMsg("Please enter your current password.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setErrorMsg("New password must be 8-16 characters long and include at least 1 uppercase letter and 1 special character.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMsg("New password cannot be the same as your current password.");
      return;
    }

    try {
      const response = await updatePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
      }).unwrap();

      setSuccessMsg(response.message || "Password updated successfully! Your account is now secured.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Failed to update password. Please check your current password.");
    }
  };

  // Show loading indicator while verifying store owner permissions
  if (isAuthLoading || !hasToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium">Verifying store owner access...</p>
      </div>
    );
  }

  // Prevent rendering if unauthorized while redirect is pending
  if (isError || (authData && !authData.isAuthenticated)) {
    return null;
  }

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security Settings</h2>
          <p className="text-sm text-slate-500">Manage your store account credentials and update your security passphrase.</p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-indigo-600" />
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>
              Ensure your store account uses a secure password to stay protected.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handlePasswordUpdate}>
            <CardContent className="space-y-4">
              {successMsg && (
                <Alert className="bg-emerald-50 text-emerald-900 border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <AlertDescription>{successMsg}</AlertDescription>
                </Alert>
              )}

              {errorMsg && (
                <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="current-pass">Current Password</Label>
                <Input
                  id="current-pass"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="new-pass">New Password</Label>
                  <span className="text-[10px] text-slate-400">8-16 chars, 1 uppercase, 1 special</span>
                </div>
                <Input
                  id="new-pass"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-pass">Confirm New Password</Label>
                <Input
                  id="confirm-pass"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/50 py-3 px-6">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Password"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
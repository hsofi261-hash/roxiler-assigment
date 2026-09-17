"use client";
import React, { useState } from "react";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Page() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const validatePassword = (password: string) => 
    /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/.test(password);

  const handlePasswordUpdate = (e: React.FormEvent) => {
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

    // Success Simulation
    setSuccessMsg("Password updated successfully! Your account is now secured.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security Settings</h2>
          <p className="text-sm text-slate-500">Manage your account credentials and update your security passphrase.</p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-indigo-600" />
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>
              Ensure your account uses a long, random password to stay secure.
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
              <Button type="submit">Update Password</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
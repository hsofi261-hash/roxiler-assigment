"use client";
import React, { useState } from "react";
import { Lock, Mail, User, MapPin, Store, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

// Mock shadcn-style UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import RTK Query hooks and types from your auth API slice
import { useLoginMutation, useSignupMutation } from "@/lib/api/authApi";

export default function AuthPage() {
  // Active Tab State
  const [activeTab, setActiveTab] = useState("login");

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup Form States
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupAddress, setSignupAddress] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Validation / Feedback States
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // RTK Query Mutations
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [signup, { isLoading: isSigningUp }] = useSignupMutation();

  // Validation Helper functions matching backend criteria
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    // 8-16 characters, at least one uppercase letter, one special character
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
    return regex.test(password);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    if (!loginEmail || !loginPassword) {
      setErrorMsg("Please fill in all login fields.");
      return;
    }
    if (!validateEmail(loginEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      const response = await login({ email: loginEmail, password: loginPassword }).unwrap();
      
      // Save token and user session data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setSuccessMsg(response.message || "Successfully logged in! Redirecting...");
      
      // Optional: Add router redirect here (e.g., router.push('/dashboard'))
    } catch (err: any) {
      // Handle RTK Query error response from backend
      setErrorMsg(err?.data?.message || "An unexpected error occurred during login.");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Name Validation: Min 20, Max 60 characters
    if (signupName.length < 20 || signupName.length > 60) {
      setErrorMsg("Name must be between 20 and 60 characters long.");
      return;
    }

    // Email Validation
    if (!validateEmail(signupEmail)) {
      setErrorMsg("Please enter a valid email format.");
      return;
    }

    // Address Validation: Max 400 characters
    if (signupAddress.length > 400) {
      setErrorMsg("Address cannot exceed 400 characters.");
      return;
    }

    // Password Validation: 8-16 chars, 1 uppercase, 1 special character
    if (!validatePassword(signupPassword)) {
      setErrorMsg("Password must be 8-16 characters long and include at least one uppercase letter and one special character.");
      return;
    }

    try {
      const response = await signup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        address: signupAddress,
      }).unwrap();

      // Auto-login upon successful signup (backend returns token & user data)
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setSuccessMsg(response.message || "Registration successful!");
      
      // Optional: Redirect or switch tab
      setTimeout(() => {
        // router.push('/dashboard') or setActiveTab("login")
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "An unexpected error occurred during registration.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6">
      
      {/* Platform Branding Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center bg-indigo-600 text-white p-3 rounded-xl shadow-md mb-2">
          <Store className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Store Rating Platform</h1>
        <p className="text-sm text-slate-500 mt-1">Manage, discover, and rate registered stores in one unified portal.</p>
      </div>

      {/* Main Authentication Card */}
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          
          <CardHeader className="pb-4">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="space-y-4">
            
            {/* Feedback Alerts */}
            {errorMsg && (
              <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
              </Alert>
            )}

            {successMsg && (
              <Alert className="bg-emerald-50 text-emerald-900 border-emerald-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-xs">{successMsg}</AlertDescription>
              </Alert>
            )}

            {/* --- LOGIN TAB CONTENT --- */}
            <TabsContent value="login" className="space-y-4 mt-0">
              <form onSubmit={handleLogin} className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="name@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoggingIn} className="w-full mt-4 flex items-center justify-center gap-2">
                  {isLoggingIn ? "Logging in..." : <>Log In <ArrowRight className="h-4 w-4" /></>}
                </Button>
              </form>
            </TabsContent>

            {/* --- SIGNUP TAB CONTENT --- */}
            <TabsContent value="signup" className="space-y-4 mt-0">
              <form onSubmit={handleSignup} className="space-y-3 pt-1">
                
                {/* Name */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <span className="text-[10px] text-slate-400">20–60 chars</span>
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="signup-name"
                      placeholder="John Doe Alexandria"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="signup-address">Address</Label>
                    <span className="text-[10px] text-slate-400">Max 400 chars</span>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="signup-address"
                      placeholder="123 Main Street, City"
                      value={signupAddress}
                      onChange={(e) => setSignupAddress(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="signup-password">Password</Label>
                    <span className="text-[10px] text-slate-400">8-16 chars, 1 uppercase, 1 special</span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isSigningUp} className="w-full mt-2 flex items-center justify-center gap-2">
                  {isSigningUp ? "Registering..." : <>Register Account <ArrowRight className="h-4 w-4" /></>}
                </Button>
              </form>
            </TabsContent>

          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
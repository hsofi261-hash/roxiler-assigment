"use client";
import React, { useState } from "react";
import { Plus, Search, ArrowUpDown, Mail, MapPin, Star, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import the RTK Query mutation hook
import { useCreateUserMutation } from "@/lib/api/userApi";

interface UsersProps {
  users: any[];
  setUsers: () => void; // Parent wrapper triggering refetchUsers()
  setSuccessMsg: (msg: string) => void;
}

export default function UsersManagement({ users, setUsers, setSuccessMsg }: UsersProps) {
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [userSortField, setUserSortField] = useState("name");
  const [userSortAsc, setUserSortAsc] = useState(true);

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserAddress, setNewUserAddress] = useState("");
  const [newUserRole, setNewUserRole] = useState("Normal User");
  const [errorMsg, setErrorMsg] = useState("");

  // RTK Query mutation hook for user creation
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/.test(password);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Frontend validations matching system constraints
    if (newUserName.length < 20 || newUserName.length > 60) {
      setErrorMsg("Name must be between 20 and 60 characters.");
      return;
    }
    if (!validateEmail(newUserEmail)) {
      setErrorMsg("Invalid email format.");
      return;
    }
    if (newUserAddress.length > 400) {
      setErrorMsg("Address cannot exceed 400 characters.");
      return;
    }
    if (!validatePassword(newUserPassword)) {
      setErrorMsg("Password must be 8-16 chars with 1 uppercase letter and 1 special character.");
      return;
    }

    try {
      // Call backend API via RTK Query mutation
      await createUser({
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        address: newUserAddress,
        role: newUserRole,
      }).unwrap();

      setSuccessMsg("User added successfully!");
      setIsAddUserOpen(false);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserAddress("");
      setNewUserRole("Normal User");
      
      // Trigger parent refetch to refresh tables and dashboard counts
      setUsers();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err?.error || "Failed to create user. Please try again.");
    }
  };

  const handleSortUsers = (field: string) => {
    if (userSortField === field) setUserSortAsc(!userSortAsc);
    else {
      setUserSortField(field);
      setUserSortAsc(true);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.address.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  }).sort((a, b) => {
    let valA = a[userSortField] || "";
    let valB = b[userSortField] || "";
    if (valA < valB) return userSortAsc ? -1 : 1;
    if (valA > valB) return userSortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-sm text-slate-500">View and manage platform users, roles, and details.</p>
        </div>
        <Button onClick={() => setIsAddUserOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New User
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Filter by Name, Email, or Address..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div>
          <select
            className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="System Administrator">System Administrator</option>
            <option value="Normal User">Normal User</option>
            <option value="Store Owner">Store Owner</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSortUsers("name")}>
                  <div className="flex items-center gap-1">Name <ArrowUpDown className="h-3.5 w-3.5" /></div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSortUsers("email")}>
                  <div className="flex items-center gap-1">Email <ArrowUpDown className="h-3.5 w-3.5" /></div>
                </th>
                <th className="p-4">Address</th>
                <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSortUsers("role")}>
                  <div className="flex items-center gap-1">Role <ArrowUpDown className="h-3.5 w-3.5" /></div>
                </th>
                <th className="p-4">Rating (If Store Owner)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-medium text-slate-900">{user.name}</td>
                    <td className="p-4 text-slate-600 flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400" />{user.email}</td>
                    <td className="p-4 text-slate-600"><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />{user.address}</span></td>
                    <td className="p-4">
                      <Badge variant={user.role === "System Administrator" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4 font-medium">
                      {user.role === "Store Owner" ? (
                        <span className="flex items-center gap-1 text-amber-600">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-500" /> {user.rating ?? 0} / 5
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400 italic">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <p className="text-sm text-slate-500">Create a new Normal or Admin user with specified credentials.</p>
          </DialogHeader>

          {errorMsg && (
            <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleAddUser} className="space-y-4 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between">
                <Label htmlFor="new-name">Full Name</Label>
                <span className="text-[10px] text-slate-400">20-60 chars</span>
              </div>
              <Input
                id="new-name"
                placeholder="Full Name required"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                disabled={isCreating}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="new-email">Email Address</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="name@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                disabled={isCreating}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <Label htmlFor="new-password">Password</Label>
                <span className="text-[10px] text-slate-400">8-16 chars, 1 upper, 1 special</span>
              </div>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                disabled={isCreating}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <Label htmlFor="new-address">Address</Label>
                <span className="text-[10px] text-slate-400">Max 400 chars</span>
              </div>
              <Input
                id="new-address"
                placeholder="Street address..."
                value={newUserAddress}
                onChange={(e) => setNewUserAddress(e.target.value)}
                disabled={isCreating}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="new-role">Role</Label>
              <select
                id="new-role"
                className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm bg-white"
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                disabled={isCreating}
              >
                <option value="">Normal User</option>
                <option value="admin">System Administrator</option>
                <option value="store_owner">Store Owner</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline" type="button" onClick={() => setIsAddUserOpen(false)} disabled={isCreating}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating} className="flex items-center gap-2">
                {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
                {isCreating ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
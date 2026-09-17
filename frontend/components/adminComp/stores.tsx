"use client";
import React, { useState } from "react";
import { Plus, Search, ArrowUpDown, Mail, MapPin, Star, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StoreProps {
  stores: any[];
  setStores: React.Dispatch<React.SetStateAction<any[]>>;
  setSuccessMsg: (msg: string) => void;
}

export default function stores({ stores, setStores, setSuccessMsg }: StoreProps) {
  const [storeSearch, setStoreSearch] = useState("");
  const [storeSortField, setStoreSortField] = useState("name");
  const [storeSortAsc, setStoreSortAsc] = useState(true);

  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreEmail, setNewStoreEmail] = useState("");
  const [newStoreAddress, setNewStoreAddress] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAddStore = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (newStoreName.length < 3 || !validateEmail(newStoreEmail) || newStoreAddress.length > 400) {
      setErrorMsg("Please check inputs: Name required, valid email, address max 400 chars.");
      return;
    }

    setStores([...stores, {
      id: stores.length + 1,
      name: newStoreName,
      email: newStoreEmail,
      address: newStoreAddress,
      rating: 0.0
    }]);

    setSuccessMsg("Store added successfully!");
    setIsAddStoreOpen(false);
    setNewStoreName("");
    setNewStoreEmail("");
    setNewStoreAddress("");
  };

  const handleSortStores = (field: string) => {
    if (storeSortField === field) setStoreSortAsc(!storeSortAsc);
    else {
      setStoreSortField(field);
      setStoreSortAsc(true);
    }
  };

  const filteredStores = stores.filter(s => {
    return s.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
           s.email.toLowerCase().includes(storeSearch.toLowerCase()) ||
           s.address.toLowerCase().includes(storeSearch.toLowerCase());
  }).sort((a, b) => {
    let valA = a[storeSortField] || "";
    let valB = b[storeSortField] || "";
    if (valA < valB) return storeSortAsc ? -1 : 1;
    if (valA > valB) return storeSortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Store Management</h2>
          <p className="text-sm text-slate-500">View registered stores, check ratings, and add new stores.</p>
        </div>
        <Button onClick={() => setIsAddStoreOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Store
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Filter stores by Name, Email, or Address..."
            value={storeSearch}
            onChange={(e) => setStoreSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSortStores("name")}>
                  <div className="flex items-center gap-1">Store Name <ArrowUpDown className="h-3.5 w-3.5" /></div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSortStores("email")}>
                  <div className="flex items-center gap-1">Email <ArrowUpDown className="h-3.5 w-3.5" /></div>
                </th>
                <th className="p-4">Address</th>
                <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSortStores("rating")}>
                  <div className="flex items-center gap-1">Overall Rating <ArrowUpDown className="h-3.5 w-3.5" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-medium text-slate-900">{store.name}</td>
                  <td className="p-4 text-slate-600 flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400" />{store.email}</td>
                  <td className="p-4 text-slate-600"><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />{store.address}</span></td>
                  <td className="p-4">
                    <Badge variant="secondary" className="flex items-center gap-1 font-semibold w-fit">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                      {store.rating}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isAddStoreOpen} onOpenChange={setIsAddStoreOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Store</DialogTitle>
            <p className="text-sm text-slate-500">Register a new store into the platform catalog.</p>
          </DialogHeader>

          {errorMsg && (
            <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">{errorMsg}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleAddStore} className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label htmlFor="store-name">Store Name</Label>
              <Input
                id="store-name"
                placeholder="Store Name"
                value={newStoreName}
                onChange={(e) => setNewStoreName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="store-email">Store Email</Label>
              <Input
                id="store-email"
                type="email"
                placeholder="store@example.com"
                value={newStoreEmail}
                onChange={(e) => setNewStoreEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <Label htmlFor="store-address">Store Address</Label>
                <span className="text-[10px] text-slate-400">Max 400 chars</span>
              </div>
              <Input
                id="store-address"
                placeholder="Store address..."
                value={newStoreAddress}
                onChange={(e) => setNewStoreAddress(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline" type="button" onClick={() => setIsAddStoreOpen(false)}>Cancel</Button>
              <Button type="submit">Register Store</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}


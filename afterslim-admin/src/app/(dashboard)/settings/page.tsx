"use client";

import { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Palette,
  Key,
  Globe,
  Shield,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved");
    }, 800);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure application preferences, manage your account, and customize the admin experience.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="size-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5 text-muted-foreground" />
            Profile
          </CardTitle>
          <CardDescription>
            Manage your personal information and account details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue="Vitor Ribeiro" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="vitor@afterslim.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue="Admin" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="america-new-york">
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america-new-york">Eastern (ET)</SelectItem>
                  <SelectItem value="america-chicago">Central (CT)</SelectItem>
                  <SelectItem value="america-denver">Mountain (MT)</SelectItem>
                  <SelectItem value="america-los-angeles">Pacific (PT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="size-5 text-muted-foreground" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose which notifications you receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { id: "orders", label: "New orders", description: "Get notified when a new order is placed", defaultChecked: true },
            { id: "lowStock", label: "Low stock alerts", description: "Alert when products drop below reorder point", defaultChecked: true },
            { id: "agents", label: "Agent alerts", description: "Get notified when an agent flags an issue", defaultChecked: true },
            { id: "weekly", label: "Weekly summary", description: "Receive a weekly business performance email", defaultChecked: false },
            { id: "marketing", label: "Marketing updates", description: "Campaign performance and creator notifications", defaultChecked: false },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <Switch defaultChecked={item.defaultChecked} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="size-5 text-muted-foreground" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select defaultValue="system">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Currency Display</Label>
              <Select defaultValue="usd">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Compact mode</p>
              <p className="text-xs text-muted-foreground">Reduce spacing for denser layout</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="size-5 text-muted-foreground" />
            Integrations
          </CardTitle>
          <CardDescription>
            Manage API keys and third-party service connections.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: "Supabase", status: "Connected", connected: true },
            { name: "Stripe", status: "Not configured", connected: false },
            { name: "OpenClaw (AI Agents)", status: "Connected", connected: true },
            { name: "Evolution API (WhatsApp)", status: "Not configured", connected: false },
            { name: "Resend (Email)", status: "Not configured", connected: false },
          ].map((integration) => (
            <div key={integration.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`size-2 rounded-full ${
                    integration.connected ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium">{integration.name}</p>
                  <p className="text-xs text-muted-foreground">{integration.status}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.info(
                    integration.connected
                      ? `${integration.name} settings`
                      : `Configure ${integration.name}`
                  )
                }
              >
                {integration.connected ? "Settings" : "Connect"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Store Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="size-5 text-muted-foreground" />
            Store Settings
          </CardTitle>
          <CardDescription>
            Global e-commerce configuration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" defaultValue="AfterSlim" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Support Email</Label>
              <Input id="storeEmail" type="email" defaultValue="support@afterslim.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="freeShipping">Free Shipping Threshold ($)</Label>
              <Input id="freeShipping" type="number" defaultValue="99" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
              <Input id="taxRate" type="number" defaultValue="0" step="0.01" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Maintenance mode</p>
              <p className="text-xs text-muted-foreground">Temporarily disable the storefront</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Shield className="size-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions. Proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Reset all agent memory</p>
              <p className="text-xs text-muted-foreground">
                Clear all stored agent insights and summaries
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:bg-red-50"
              onClick={() => toast.error("This action requires confirmation")}
            >
              Reset Memory
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Export all data</p>
              <p className="text-xs text-muted-foreground">
                Download a complete backup of all business data
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Export coming soon")}
            >
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

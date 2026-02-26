import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Account Settings | AfterSlim",
  description: "Manage your account settings.",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your name and contact details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input placeholder="+1 (555) 123-4567" />
            </div>
          </div>
          <Button size="sm">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
          <CardDescription>
            Your email address is used for login and order notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input type="email" placeholder="you@example.com" disabled />
          </div>
          <p className="text-xs text-muted-foreground">
            Contact support to change your email address.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input type="password" placeholder="At least 6 characters" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input type="password" placeholder="Repeat your password" />
          </div>
          <Button size="sm">Update Password</Button>
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" size="sm">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

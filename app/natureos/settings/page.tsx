"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    })
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your NatureOS account and preferences." />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Dr. Elara Vance" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="e.vance@mycosoft.com" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>API Key</CardTitle>
            <CardDescription>Manage your API key for third-party integrations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input readOnly value="myco_sk_live_******************1234" />
              <Button variant="outline">Copy</Button>
              <Button variant="destructive">Revoke</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="system-alerts">System Alerts</Label>
              <Switch id="system-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="research-updates">Research Updates</Label>
              <Switch id="research-updates" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="api-usage">API Usage Warnings</Label>
              <Switch id="api-usage" />
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </DashboardShell>
  )
}

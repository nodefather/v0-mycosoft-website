"use client"

import type React from "react"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function NewProjectPage() {
  const { toast } = useToast()
  const [projectName, setProjectName] = useState("")
  const [projectType, setProjectType] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend API
    console.log({ projectName, projectType, description })

    toast({
      title: "Project Created!",
      description: `The project "${projectName}" has been successfully created.`,
    })

    // Reset form
    setProjectName("")
    setProjectType("")
    setDescription("")
  }

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Create a New Project</h1>
        <p className="text-muted-foreground mb-8">Start a new research, commercial, or personal project in NatureOS.</p>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Provide the basic information for your new project.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="e.g., Mycelial Bioremediation Study"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-type">Project Type</Label>
                <Select value={projectType} onValueChange={setProjectType} required>
                  <SelectTrigger id="project-type">
                    <SelectValue placeholder="Select a project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="personal">Personal / Hobbyist</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe the goals and scope of this project."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={!projectName || !projectType}>
                  Create Project
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

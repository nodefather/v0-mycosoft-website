"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { FileBrowser } from "@/components/natureos/file-browser"
import { useEffect, useState } from "react"

type File = {
  name: string
  type: "folder" | "file"
  size: string
  modified: string
}

export default function CloudStoragePage() {
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/natureos/files")
      .then((res) => res.json())
      .then((data) => {
        setFiles(data)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Cloud Storage" text="Loading your files..." />
        <div className="h-[400px] w-full flex items-center justify-center bg-muted rounded-lg">
          <p>Loading file browser...</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Cloud Storage" text="Manage your data stored on the Mycosoft Cloud." />
      <FileBrowser files={files} />
    </DashboardShell>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Folder, FileIcon, Loader2, AlertTriangle } from "lucide-react"
import type { FileNode } from "@/types/natureos"

export function FileBrowser() {
  const [files, setFiles] = useState<FileNode[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // Fetch from the internal mock API route
        const response = await fetch(`/api/natureos/files`)
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`)
        }
        const result: FileNode[] = await response.json()
        setFiles(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred while fetching files.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFiles()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <p>Loading Files...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-destructive">
        <AlertTriangle className="mr-2 h-6 w-6" />
        <p>Error loading files:</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Last Modified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((node) => (
            <TableRow key={node.id} className="hover:bg-muted/50 cursor-pointer">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {node.type === "folder" ? (
                    <Folder className="h-4 w-4 text-blue-500" />
                  ) : (
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                  {node.name}
                </div>
              </TableCell>
              <TableCell>{node.size || "—"}</TableCell>
              <TableCell>{new Date(node.modified).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

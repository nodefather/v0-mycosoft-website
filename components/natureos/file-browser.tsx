"use client"

import { CardContent } from "@/components/ui/card"

import { CardDescription } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Folder } from "lucide-react"

type CloudFile = {
  name: string
  type: "folder" | "file"
  size: string
  modified: string
}

interface FileBrowserProps {
  files: CloudFile[]
}

export function FileBrowser({ files }: FileBrowserProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cloud Storage</CardTitle>
        <CardDescription>Browse and manage your files stored on the Mycosoft Cloud.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Last Modified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.name}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {file.type === "folder" ? (
                      <Folder className="h-4 w-4 text-primary" />
                    ) : (
                      <span className="h-4 w-4 text-muted-foreground">📄</span>
                    )}
                    {file.name}
                  </div>
                </TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>{file.modified}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

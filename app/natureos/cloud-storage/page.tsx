import { DashboardShell } from "@/components/dashboard/shell"
import { FileBrowser } from "@/components/natureos/file-browser"
import { Button } from "@/components/ui/button"
import { Upload, FolderPlus, HardDrive } from "lucide-react"

export default function CloudStoragePage() {
  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Cloud Storage</h1>
          <p className="text-muted-foreground">Manage your project files and data synced from NatureOS devices.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-4 flex justify-between items-center bg-muted/50 mb-8">
        <div className="flex items-center gap-3">
          <HardDrive className="h-6 w-6 text-muted-foreground" />
          <div>
            <p className="font-medium">Storage Usage</p>
            <p className="text-sm text-muted-foreground">1.8TB of 2.5TB used</p>
          </div>
        </div>
        <Button variant="secondary" size="sm">
          Manage Plan
        </Button>
      </div>

      <FileBrowser />
    </DashboardShell>
  )
}

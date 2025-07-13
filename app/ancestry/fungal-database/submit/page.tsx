import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"

export default function SubmitSpeciesPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Submit New Species" text="Contribute to our growing database of fungal species." />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>New Species Submission</CardTitle>
            <CardDescription>
              Please provide as much detail as possible. All submissions will be reviewed by our team.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scientific-name">Scientific Name</Label>
                <Input id="scientific-name" placeholder="e.g., Amanita muscaria" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="common-name">Common Name</Label>
                <Input id="common-name" placeholder="e.g., Fly Agaric" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe the species, its habitat, and characteristics." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-upload">Upload Image</Label>
              <Input id="image-upload" type="file" />
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Submit for Review
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

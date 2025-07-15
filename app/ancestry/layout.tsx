import type React from "react"
import Link from "next/link"
import { GitBranch } from "lucide-react"

export default function AncestryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b shadow-sm dark:border-gray-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 text-white p-2 rounded-md">
              <GitBranch className="h-5 w-5" />
            </div>
            <Link href="/natureos/apps/ancestry">
              <h1 className="text-xl font-bold text-foreground">Fungal Ancestry</h1>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/natureos" className="text-sm font-medium text-foreground/80 hover:text-green-600">
              NatureOS
            </Link>
            <Link
              href="/natureos/apps/ancestry?tab=explorer"
              className="text-sm font-medium text-foreground/80 hover:text-green-600"
            >
              Explorer
            </Link>
            <Link
              href="/natureos/apps/ancestry?tab=tools"
              className="text-sm font-medium text-foreground/80 hover:text-green-600"
            >
              Tools
            </Link>
            <Link
              href="/natureos/apps/ancestry?tab=phylogeny"
              className="text-sm font-medium text-foreground/80 hover:text-green-600"
            >
              Phylogeny
            </Link>
          </nav>
          <button className="md:hidden p-2 text-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-background border-t py-6 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center text-sm text-foreground/70">
          © {new Date().getFullYear()} Mycosoft Fungal Ancestry. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

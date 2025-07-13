import { Skeleton } from "@/components/ui/skeleton"

export default function FungiProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-9 w-40" />
      </div>
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="aspect-square w-full rounded-md" />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div>
              <Skeleton className="h-10 w-3/4 mb-2" />
              <Skeleton className="h-8 w-1/2" />
            </div>

            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-5 w-5 rounded-full mt-1" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Skeleton className="h-10 w-full mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

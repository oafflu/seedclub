import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoginLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Skeleton className="h-12 w-48" />
        </div>

        <div className="rounded-lg border-2 bg-card p-6 shadow-sm">
          <div className="space-y-2 pb-4 text-center">
            <Skeleton className="mx-auto h-8 w-40" />
            <Skeleton className="mx-auto h-4 w-60" />
          </div>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>

            <Skeleton className="h-10 w-full" />
          </div>

          <div className="pt-4 text-center">
            <Skeleton className="mx-auto h-4 w-48" />
            <Skeleton className="mx-auto mt-4 h-4 w-32" />
          </div>
        </div>

        <div className="mt-6 text-center">
          <Skeleton className="mx-auto h-4 w-60" />
        </div>
      </div>
    </div>
  )
}

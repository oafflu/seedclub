import { Skeleton } from "@/components/ui/skeleton"

export default function EditMarketingPageLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-8 w-[200px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[120px]" />
          <Skeleton className="h-9 w-[120px]" />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-2/3">
          <Skeleton className="h-[200px] w-full mb-6" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-9 w-[120px]" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[150px] w-full" />
              ))}
            </div>
          </div>
        </div>

        <div className="w-1/3">
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    </div>
  )
}

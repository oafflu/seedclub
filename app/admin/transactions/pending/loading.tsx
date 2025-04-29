import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PendingTransactionsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-6">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-28" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          <div className="rounded-md border">
            <div className="p-4">
              <div className="grid grid-cols-9 gap-4 pb-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="py-4 border-t">
                  <div className="grid grid-cols-9 gap-4">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

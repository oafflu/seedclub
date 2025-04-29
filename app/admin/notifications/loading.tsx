import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotificationsLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>
                <Skeleton className="h-6 w-40" />
              </CardTitle>
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-56 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-24" />
              </div>

              <div className="flex gap-2 mb-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>

              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="flex gap-1">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-6 w-40 mb-4" />
                    <div className="space-y-4">
                      {Array(4)
                        .fill(0)
                        .map((_, j) => (
                          <div key={j} className="flex items-center justify-between">
                            <div>
                              <Skeleton className="h-5 w-40 mb-1" />
                              <Skeleton className="h-4 w-56" />
                            </div>
                            <Skeleton className="h-10 w-32" />
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

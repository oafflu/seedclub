import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container space-y-6 px-4 py-6">
      <div className="flex items-center">
        <Skeleton className="mr-2 h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-40" />
      </div>

      <div className="flex items-center justify-between px-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-1 w-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-1 w-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"

export default function IssuesLoadingPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <Skeleton className="h-8 w-[200px] mb-2" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      <div className="flex gap-4">
        <Skeleton className="h-10 w-[180px]" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <Skeleton className="h-[500px] w-full" />
    </div>
  )
}

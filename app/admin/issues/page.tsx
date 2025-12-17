import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { IssuesContent } from "./issue-content"

export default function IssuesPage() {
  return (
    <div className="space-y-6 md:p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Issue Reports</h1>
        <p className="text-muted-foreground">Manage user-reported issues for chapters and novels</p>
      </div>

      <Suspense fallback={<LoadingState />}>
        <IssuesContent />
      </Suspense>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[200px]" />
      </div>
      <Skeleton className="h-[500px] w-full" />
    </div>
  )
}

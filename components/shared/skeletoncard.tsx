'use client'
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3  flex-grow mx-2 xl:ml-28 xl:mr-96 lg:mx-32 md:mx-40 sm:mx-20">
      <Skeleton className="h-[300px] w-[440px] rounded-xl mt-11  max-w-auto " />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[170px]" />
      </div>
    </div>
  )
}

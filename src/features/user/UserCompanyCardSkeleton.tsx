import { Skeleton } from "@/components/shadcn/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shadcn/card";

export default function UserCompanyCardSkeleton() {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6'>
      {Array(5).fill(0).map((_, i) => (
        <Card key={i}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              <Skeleton className="h-5 w-20" />
            </CardTitle>
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-8 mb-1" />
            <Skeleton className="h-4 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

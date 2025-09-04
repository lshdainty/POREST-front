import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card';
import { Skeleton } from '@/components/shadcn/skeleton';

export default function VacationTypeStatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className='items-center pb-0'>
        <CardTitle>
          <Skeleton className='h-6 w-24' />
        </CardTitle>
        <CardDescription>
          <Skeleton className='h-4 w-40 mt-1' />
        </CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0 flex justify-center items-center'>
        <Skeleton className='w-[240px] h-[240px] rounded-full' />
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm pt-4'>
        <div className='flex w-full items-center justify-center gap-4 text-muted-foreground'>
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-4 w-16' />
        </div>
      </CardFooter>
    </Card>
  );
}
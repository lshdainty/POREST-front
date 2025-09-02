import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Skeleton } from '@/components/shadcn/skeleton'
import { DollarSign, Users, BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react';

export default function TotalDuesSkeleton() {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>전체 운영비</CardTitle>
          <DollarSign className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-8 w-3/4' />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>운영비 입금</CardTitle>
          <BanknoteArrowUp className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-8 w-3/4' />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>운영비 출금</CardTitle>
          <BanknoteArrowDown className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-8 w-3/4' />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>월 생일비</CardTitle>
          <Users className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-8 w-3/4' />
        </CardContent>
      </Card>
    </div>
  );
}
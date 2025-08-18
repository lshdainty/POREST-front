import { useState, useEffect } from 'react';
import { useGetUsers } from '@/api/user';
import { useGetUserMonthStatsVacationUseHistories } from '@/api/vacation';
import UserInfoCard from '@/features/vacation/UserInfoCard';
import UserInfoCardSkeleton from '@/features/vacation/UserInfoCardSkeleton';
import VacationStatsCard from '@/features/vacation/VacationStatsCard';
import VacationStatsCardSkeleton from '@/features/vacation/VacationStatsCardSkeleton';
import MonthVacationStatsCard from '@/features/vacation/MonthVacationStatsCard';
import MonthVacationStatsCardSkeleton from '@/features/vacation/MonthVacationStatsCardSkeleton';
import VacationTypeStatsCard from '@/features/vacation/VacationTypeStatsCard';
import VacationTypeStatsCardSkeleton from '@/features/vacation/VacationTypeStatsCardSkeleton';
import VacationHistoryTable from '@/features/vacation/VacationHistoryTable';
import VacationHistoryTableSkeleton from '@/features/vacation/VacationHistoryTableSkeleton';
import dayjs from 'dayjs';

export default function Vacation() {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const { data: users, isLoading: usersLoading } = useGetUsers();
  const { data: monthStats, isLoading: monthStatsLoading } = useGetUserMonthStatsVacationUseHistories({
    user_id: selectedUserId,
    year: dayjs().format('YYYY'),
  });

  useEffect(() => {
    if (users && users.length > 0 && !selectedUserId) {
      setSelectedUserId(users[0].user_id);
    }
  }, [users, selectedUserId]);

  if (usersLoading || monthStatsLoading) {
    return (
      <div className='p-4 sm:p-6 md:p-8'>
        <h1 className='text-3xl font-bold mb-6'>휴가 관리</h1>
        <div className='flex flex-col lg:flex-row gap-6'>
          <UserInfoCardSkeleton />
          <div className='flex flex-col gap-6 flex-1'>
            <VacationStatsCardSkeleton />
            <MonthVacationStatsCardSkeleton />
          </div>
        </div>
        <div className='flex flex-col xl:flex-row gap-6 mt-6'>
          <div className='xl:w-1/3 flex flex-col'>
            <VacationTypeStatsCardSkeleton />
          </div>
          <div className='xl:w-2/3'>
            <VacationHistoryTableSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!selectedUserId) {
    return (
        <div className='p-4 sm:p-6 md:p-8'>
            <h1 className='text-3xl font-bold mb-6'>휴가 관리</h1>
            <div>사용자 정보가 없습니다.</div>
        </div>
    );
  }

  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <h1 className='text-3xl font-bold mb-6'>휴가 관리</h1>
      <div className='flex flex-col lg:flex-row gap-6'>
        <UserInfoCard
          value={users || []}
          selectedUserId={selectedUserId}
          onUserChange={setSelectedUserId}
        />
        <div className='flex flex-col gap-6 flex-1'>
          <VacationStatsCard />
          <MonthVacationStatsCard
            value={monthStats || []}
          />
        </div>
      </div>
      <div className='flex flex-col xl:flex-row gap-6 mt-6'>
        <div className='xl:w-1/3 flex flex-col'>
          <VacationTypeStatsCard />
        </div>
        <div className='xl:w-2/3'>
          <VacationHistoryTable />
        </div>
      </div>
    </div>
  );
}
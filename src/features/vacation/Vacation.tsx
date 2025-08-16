import { useGetUsers } from '@/api/user';
import UserInfoCard from '@/features/vacation/UserInfoCard';
import VacationStatsCard from '@/features/vacation/VacationStatsCard';
import MonthVacationStatsCard from '@/features/vacation/MonthVacationStatsCard';
import VacationTypeStatsCard from '@/features/vacation/VacationTypeStatsCard';
import VacationHistoryTable from '@/features/vacation/VacationHistoryTable';

export default function Vacation() {
  const { data: users, isLoading: usersLoading } = useGetUsers();

  if (usersLoading) {
    return (
      <></>
    )
  }

  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <h1 className='text-3xl font-bold mb-6'>휴가 관리</h1>
      <div className='flex flex-col lg:flex-row gap-6'>
        <UserInfoCard value={users || []} />
        <div className='flex flex-col gap-6 flex-1'>
          <VacationStatsCard />
          <MonthVacationStatsCard />
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
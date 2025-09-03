import { useGetYearOperationDues, useGetMonthBirthDues, useGetUsersMonthBirthDues, useGetYearDues } from '@/api/dues';
import { useGetUsers } from '@/api/user';
import TotalDues from '@/features/culture/dues/TotalDues';
import UserBirthDues from '@/features/culture/dues/UserBirthDues';
import DuesTable from '@/features/culture/dues/DuesTable';
import TotalDuesSkeleton from './TotalDuesSkeleton';
import UserBirthDuesSkeleton from './UserBirthDuesSkeleton';
import DuesTableSkeleton from './DuesTableSkeleton';
import dayjs from 'dayjs';

export default function Dues() {
  const { isLoading: totalDuesLoading } = useGetYearOperationDues({ year: dayjs().format('YYYY') });
  const { isLoading: birthDuesLoading } = useGetMonthBirthDues({ year: dayjs().format('YYYY'), month: dayjs().format('MM') });
  const { isLoading: usersBirthDuesLoading } = useGetUsersMonthBirthDues({ year: dayjs().format('YYYY') });
  const { isLoading: usersLoading } = useGetUsers();
  const { isLoading: yearDuesLoading } = useGetYearDues({ year: dayjs().format('YYYY') });

  const totalDuesCombinedLoading = totalDuesLoading || birthDuesLoading;
  const userBirthDuesCombinedLoading = usersBirthDuesLoading || usersLoading;

  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <div className='mb-6'>
        {totalDuesCombinedLoading ? <TotalDuesSkeleton /> : <TotalDues />}
      </div>
      <div className='mb-6'>
        {userBirthDuesCombinedLoading ? <UserBirthDuesSkeleton /> : <UserBirthDues />}
      </div>
      {yearDuesLoading ? <DuesTableSkeleton /> : <DuesTable />}
    </div>
  );
}
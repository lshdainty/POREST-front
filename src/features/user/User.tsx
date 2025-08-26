import { useGetUsers } from '@/api/user';
import UserTable from '@/features/user/UserTable';
import UserTableSkeleton from '@/features/user/UserTableSkeleton';
import UserCompanyCard from '@/features/user/UserCompanyCard';
import UserCompanyCardSkeleton from '@/features/user/UserCompanyCardSkeleton';

export default function User() {
  const { data: users, isLoading: usersLoading } = useGetUsers();

  if (usersLoading) {
    return (
      <div className='p-4 sm:p-6 md:p-8'>
        <h1 className='text-3xl font-bold mb-6'>사용자 관리</h1>
        <UserCompanyCardSkeleton />
        <UserTableSkeleton />
      </div>
    )
  }

  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <h1 className='text-3xl font-bold mb-6'>사용자 관리</h1>
      <UserCompanyCard value={users || []} />
      <UserTable value={users || []} />
    </div>
  );
}
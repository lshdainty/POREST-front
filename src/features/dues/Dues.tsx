import TotalDues from '@/features/dues/TotalDues';
import UserBirthDues from '@/features/dues/UserBirthDues';
import DuesTable from '@/features/dues/DuesTable';

export default function Dues() {
  return (
    <div className="w-full h-full flex flex-col gap-6 p-4 lg:p-6">
      <TotalDues />
      <UserBirthDues />
      <DuesTable />
    </div>
  );
}

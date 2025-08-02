import TotalDues from '@/features/culture/TotalDues';
import UserBirthDues from '@/features/culture/UserBirthDues';
import DuesTable from '@/features/culture/DuesTable';

export default function Culture() {
  return (
    <div className="w-full h-full flex flex-col gap-6 p-4 lg:p-6">
      <TotalDues />
      <UserBirthDues />
      <DuesTable />
    </div>
  );
}

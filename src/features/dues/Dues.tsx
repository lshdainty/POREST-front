import TotalDues from '@/features/dues/TotalDues';
import UserBirthDues from '@/features/dues/UserBirthDues';
import DuesTable from '@/features/dues/DuesTable';

export default function Dues() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6">
        <TotalDues />
      </div>
      <div className="mb-6">
        <UserBirthDues />
      </div>
      <DuesTable />
    </div>
  );
}
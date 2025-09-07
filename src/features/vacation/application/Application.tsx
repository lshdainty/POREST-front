import { useState } from 'react';
import ApplicationTable from '@/features/vacation/application/ApplicationTable';
import ApplicationFormDialog from '@/features/vacation/application/ApplicationForm';

export default function Application() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateNew = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSubmitSuccess = () => {
    setIsDialogOpen(false);
    // 여기에 데이터 새로고침 로직 추가 가능
  };

  return (
    <div className='p-4 sm:p-6 md:p-8'>
      <ApplicationTable onCreateNew={handleCreateNew} />
      <ApplicationFormDialog 
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmitSuccess={handleSubmitSuccess}
      />
    </div>
  );
}

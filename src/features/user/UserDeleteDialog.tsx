import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/shadcn/alertDialog';
import { GetUsersResp } from '@/api/user';
import { TriangleAlert } from 'lucide-react';

interface UserDeleteDialogProps {
  user: GetUsersResp;
  trigger: React.ReactNode;
  onDelete: (id: string) => void;
}

export default function UserDeleteDialog({ user, trigger, onDelete }: UserDeleteDialogProps) {
  const handleDelete = () => {
    if (user.user_id !== '') {
      onDelete(user.user_id);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-lg">
        <div className="flex items-start space-x-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <TriangleAlert className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <AlertDialogHeader className="flex-1">
            <AlertDialogTitle>사용자 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말 {user.user_name} 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 사용자의 모든 데이터가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction variant='destructive' onClick={handleDelete}>
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

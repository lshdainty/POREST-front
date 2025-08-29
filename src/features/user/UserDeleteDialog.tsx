import { useState } from 'react';
import { GetUsersResp } from '@/api/user';
import { Button } from '@/components/shadcn/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger, DialogDescription } from '@/components/shadcn/dialog';

interface UserDeleteDialogProps {
  user: GetUsersResp;
  trigger: React.ReactNode;
  onDelete: (id: string) => void;
}

export default function UserDeleteDialog({ user, trigger, onDelete }: UserDeleteDialogProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    if (user.user_id !== '') {
      onDelete(user.user_id);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 삭제</DialogTitle>
          <DialogDescription>
            정말 이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>취소</Button>
          </DialogClose>
          <Button variant='destructive' onClick={handleDelete}>삭제</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

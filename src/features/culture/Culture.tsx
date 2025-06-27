import { cn } from "@/lib/utils"

import { useGetUsers } from '@/hooks/useUserApi';

export default function Culture() {
  const { data, isLoading, error } = useGetUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data || data.length === 0) return <div>No users found</div>;

  return (
    <div
      className={cn(
        "flex w-full h-full p-[10px]" 
      )}
    >
      <h1>culture page</h1>
      {data?.map((user) => (
        <div key={user.userNo}>
          <p>{user.userName}</p>
          <p>{user.userEmploy}</p>
          <p>{user.userBirth}</p>
          <p>{user.userWorkTime}</p>
        </div>
      ))}
    </div>
  );
}
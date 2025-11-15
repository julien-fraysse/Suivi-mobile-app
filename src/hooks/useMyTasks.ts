import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyTasks, MyTasksFilters, MyTasksPage, Task } from '../api/tasks';
import { useAuth } from '../auth';

export type UseMyTasksOptions = {
  filters?: MyTasksFilters;
};

export function useMyTasks(options: UseMyTasksOptions = {}) {
  const { filters } = options;
  const { accessToken } = useAuth();

  const query = useInfiniteQuery<MyTasksPage>({
    queryKey: ['myTasks', filters],
    enabled: !!accessToken,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      if (!accessToken) {
        throw new Error('No access token');
      }
      return getMyTasks(accessToken, {
        page: pageParam as number,
        pageSize: 20,
        filters,
      });
    },
    getNextPageParam: (lastPage) => {
      const { page, pageSize, total } = lastPage;
      const maxPage = Math.ceil(total / pageSize);
      if (page >= maxPage) return undefined;
      return page + 1;
    },
  });

  const tasks: Task[] =
    query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    tasks,
  };
}


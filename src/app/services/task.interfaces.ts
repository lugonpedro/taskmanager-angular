export interface Task {
  id: number;
  title: string;
  description?: string;
  limitDate?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'TODO' | 'DOING' | 'DONE';

export type GroupedTasks = Record<TaskStatus, Task[]>;

export interface CreateTaskDto {
  title: string;
  description?: string;
  limitDate?: string;
  status?: TaskStatus;
}

export interface UpdateTaskDto {
  title: string;
  description?: string;
  limitDate?: string;
}

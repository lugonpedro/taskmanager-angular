import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

interface Task {
  id: number;
  title: string;
  description: null | string;
  limitDate: null | string;
  status: 'TODO' | 'DOING' | 'DONE';
  createdAt: string;
  updatedAt: string;
}

export type GroupedTasks = Record<'TODO' | 'DOING' | 'DONE', Task[]>;

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly _httpClient = inject(HttpClient);
  private readonly api = 'http://localhost:8080';

  getTasks(): Observable<GroupedTasks> {
    return this._httpClient.get<Task[]>(`${this.api}/tasks`).pipe(
      map((tasks) =>
        tasks.reduce(
          (acc, task) => {
            acc[task.status].push(task);
            return acc;
          },
          { TODO: [], DOING: [], DONE: [] } as GroupedTasks
        )
      )
    );
  }
}

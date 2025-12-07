import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  CreateTaskDto,
  GroupedTasks,
  Task,
} from './task.interfaces';

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

  createTask(dto: CreateTaskDto): Observable<Task> {
    return this._httpClient.post<Task>(`${this.api}/tasks`, dto);
  }
}

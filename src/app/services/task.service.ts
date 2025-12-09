import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  CreateTaskDto,
  GroupedTasks,
  Task,
  TaskStatus,
  UpdateTaskDto,
} from './task.interfaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly _httpClient = inject(HttpClient);

  getTasks(): Observable<GroupedTasks> {
    return this._httpClient.get<Task[]>(`${environment.apiUrl}/tasks`).pipe(
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
    return this._httpClient.post<Task>(`${environment.apiUrl}/tasks`, dto);
  }

  updateTask(id: number, dto: UpdateTaskDto): Observable<Task> {
    return this._httpClient.put<Task>(`${environment.apiUrl}/tasks/${id}`, dto);
  }

  deleteTask(id: number): Observable<Task> {
    return this._httpClient.delete<Task>(`${environment.apiUrl}/tasks/${id}`);
  }

  updateTaskStatus(id: number, newStatus: TaskStatus): Observable<Task> {
    return this._httpClient.put<Task>(`${environment.apiUrl}/tasks/${id}`, {
      status: newStatus,
    });
  }
}

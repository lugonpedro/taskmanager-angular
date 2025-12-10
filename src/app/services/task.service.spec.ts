import { TestBed } from '@angular/core/testing';

import { TaskService } from './task.service';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Task, TaskStatus } from './task.interfaces';
import { environment } from '../../environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getTasks should return tasks grouped by status', () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'T1',
        description: 'd1',
        status: 'TODO',
        limitDate: '2025-01-01',
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 2,
        title: 'T2',
        description: 'd2',
        status: 'DOING',
        limitDate: '2025-01-02',
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 3,
        title: 'T3',
        description: 'd3',
        status: 'DONE',
        limitDate: '2025-01-03',
        createdAt: '',
        updatedAt: '',
      },
    ];

    let result: any;

    service.getTasks().subscribe((res) => {
      result = res;
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('GET');

    req.flush(mockTasks);

    expect(result.TODO.length).toBe(1);
    expect(result.DOING.length).toBe(1);
    expect(result.DONE.length).toBe(1);
  });

  it('createTask should call POST /tasks with the correct DTO', () => {
    const dto = { title: 'Nova', description: 'Desc', limitDate: '2025-01-01' };
    const mockResponse: Task = {
      id: 1,
      status: 'TODO',
      createdAt: '',
      updatedAt: '',
      ...dto,
    };

    let result: Task | undefined;

    service.createTask(dto).subscribe((res) => (result = res));

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);

    req.flush(mockResponse);

    expect(result).toEqual(mockResponse);
  });

  it('updateTask should call PUT /tasks/:id with the correct DTO', () => {
    const dto = { title: 'Edit', description: 'Edit', limitDate: '2025-01-02' };
    const mockResponse: Task = {
      id: 10,
      status: 'DOING',
      createdAt: '',
      updatedAt: '',
      ...dto,
    };

    let result: Task | undefined;

    service.updateTask(10, dto).subscribe((res) => (result = res));

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/10`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(dto);

    req.flush(mockResponse);

    expect(result).toEqual(mockResponse);
  });

  it('deleteTask should call DELETE /tasks/:id', () => {
    const mockResponse: Task = {
      id: 5,
      title: 'X',
      description: 'Y',
      status: 'DONE',
      limitDate: '2025-03-03',
      createdAt: '',
      updatedAt: '',
    };

    let result: Task | undefined;

    service.deleteTask(5).subscribe((res) => (result = res));

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/5`);
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);

    expect(result).toEqual(mockResponse);
  });

  it('updateTaskStatus should call PUT /tasks/:id with status in the request body', () => {
    const mockResponse: Task = {
      id: 3,
      title: 'Task 3',
      description: 'd3',
      status: 'DONE',
      limitDate: '2025-02-02',
      createdAt: '',
      updatedAt: '',
    };

    let result: Task | undefined;
    const newStatus: TaskStatus = 'DONE';

    service.updateTaskStatus(3, newStatus).subscribe((res) => (result = res));

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks/3`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ status: newStatus });

    req.flush(mockResponse);

    expect(result).toEqual(mockResponse);
  });
});

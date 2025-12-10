import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskBoardComponent } from './task-board.component';
import { of, throwError } from 'rxjs';
import { GroupedTasks, Task, TaskStatus } from '../../services/task.interfaces';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';

describe('TaskBoardComponent', () => {
  let component: TaskBoardComponent;
  let fixture: ComponentFixture<TaskBoardComponent>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;
  let toastServiceMock: jasmine.SpyObj<ToastService>;

  const initialTasks: GroupedTasks = {
    TODO: [
      {
        id: 1,
        title: 'Todo 1',
        description: 'Desc 1',
        status: 'TODO',
        limitDate: '2025-01-01',
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 2,
        title: 'Todo 2',
        description: 'Desc 2',
        status: 'TODO',
        limitDate: '2025-01-02',
        createdAt: '',
        updatedAt: '',
      },
    ],
    DOING: [
      {
        id: 3,
        title: 'Doing 1',
        description: 'Desc 3',
        status: 'DOING',
        limitDate: '2025-02-01',
        createdAt: '',
        updatedAt: '',
      },
    ],
    DONE: [
      {
        id: 4,
        title: 'Done 1',
        description: 'Desc 4',
        status: 'DONE',
        limitDate: '2025-03-01',
        createdAt: '',
        updatedAt: '',
      },
    ],
  };

  beforeEach(async () => {
    taskServiceMock = jasmine.createSpyObj<TaskService>('TaskService', [
      'getTasks',
      'createTask',
      'updateTask',
      'deleteTask',
      'updateTaskStatus',
    ]);

    toastServiceMock = jasmine.createSpyObj<ToastService>('ToastService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [TaskBoardComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskBoardComponent);
    component = fixture.componentInstance;
    component.tasks = JSON.parse(JSON.stringify(initialTasks));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onAddCard should create a task, append it to the correct column and show success toast', () => {
    const status: TaskStatus = 'TODO';
    const title = 'New task';

    const createdTask: Task = {
      id: 10,
      title,
      description: '',
      status,
      limitDate: '',
      createdAt: '',
      updatedAt: '',
    };

    taskServiceMock.createTask.and.returnValue(of(createdTask));

    const initialLength = component.tasks[status].length;

    component.onAddCard(status, title);

    expect(taskServiceMock.createTask).toHaveBeenCalledWith({ title, status });
    expect(component.tasks[status].length).toBe(initialLength + 1);
    expect(component.tasks[status][component.tasks[status].length - 1]).toEqual(
      createdTask
    );
    expect(toastServiceMock.success).toHaveBeenCalledWith('Task created');
  });

  it('onAddCard should show specific error toast when title is missing', () => {
    const status: TaskStatus = 'TODO';
    const title = '';

    const apiError = {
      error: { title: 'Title is required' },
    };

    taskServiceMock.createTask.and.returnValue(
      throwError(() => apiError as any)
    );

    component.onAddCard(status, title);

    expect(taskServiceMock.createTask).toHaveBeenCalledWith({ title, status });
    expect(toastServiceMock.error).toHaveBeenCalledWith('Please fill in task title');
  });

  it('onAddCard should show generic error toast on unknown error', () => {
    const status: TaskStatus = 'TODO';
    const title = 'Any title';

    taskServiceMock.createTask.and.returnValue(
      throwError(() => ({ error: {} } as any))
    );

    component.onAddCard(status, title);

    expect(taskServiceMock.createTask).toHaveBeenCalledWith({ title, status });
    expect(toastServiceMock.error).toHaveBeenCalledWith('Error to create a task');
  });
});

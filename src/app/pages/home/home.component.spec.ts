import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { HomeComponent } from './home.component';
import { TaskService } from '../../services/task.service';
import { ToastService } from '../../services/toast.service';
import {
  GroupedTasks,
  Task,
  CreateTaskDto,
  UpdateTaskDto,
} from '../../services/task.interfaces';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  let taskServiceMock: jasmine.SpyObj<TaskService>;
  let toastServiceMock: jasmine.SpyObj<ToastService>;

  const mockGroupedTasks: GroupedTasks = {
    TODO: [
      {
        id: 1,
        title: 'Todo Task',
        description: 'Desc 1',
        status: 'TODO',
        limitDate: '2025-01-01',
        createdAt: '',
        updatedAt: '',
      },
    ],
    DOING: [
      {
        id: 2,
        title: 'Doing Task',
        description: 'Desc 2',
        status: 'DOING',
        limitDate: '2025-01-02',
        createdAt: '',
        updatedAt: '',
      },
    ],
    DONE: [
      {
        id: 3,
        title: 'Done Task',
        description: 'Desc 3',
        status: 'DONE',
        limitDate: '2025-01-03',
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
    ]);

    toastServiceMock = jasmine.createSpyObj<ToastService>('ToastService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  function initWithGetTasksSuccess() {
    taskServiceMock.getTasks.and.returnValue(of(mockGroupedTasks));
    fixture.detectChanges();
  }

  it('should create', () => {
    initWithGetTasksSuccess();
    expect(component).toBeTruthy();
  });

  it('ngOnInit should load tasks and set loading to false', () => {
    taskServiceMock.getTasks.and.returnValue(of(mockGroupedTasks));

    fixture.detectChanges();

    expect(taskServiceMock.getTasks).toHaveBeenCalledTimes(1);
    expect(component.tasks).toEqual(mockGroupedTasks);
    expect(component.loading).toBeFalse();
  });

  it('loadTasks should show error toast and set loading to false when request fails', () => {
    taskServiceMock.getTasks.and.returnValue(
      throwError(() => new Error('Failed to load'))
    );

    fixture.detectChanges();

    expect(taskServiceMock.getTasks).toHaveBeenCalledTimes(1);
    expect(toastServiceMock.error).toHaveBeenCalledWith('Error loading tasks');
    expect(component.loading).toBeFalse();
  });

  it('openNewTaskModal should set isNewTaskModalOpen to true', () => {
    initWithGetTasksSuccess();

    component.isNewTaskModalOpen = false;
    component.openNewTaskModal();

    expect(component.isNewTaskModalOpen).toBeTrue();
  });

  it('closeNewTaskModal should set isNewTaskModalOpen to false', () => {
    initWithGetTasksSuccess();

    component.isNewTaskModalOpen = true;
    component.closeNewTaskModal();

    expect(component.isNewTaskModalOpen).toBeFalse();
  });

  it('openDetails should set selectedTask and open details modal', () => {
    initWithGetTasksSuccess();

    const task: Task = mockGroupedTasks.TODO[0];

    component.openDetails(task);

    expect(component.selectedTask).toEqual(task);
    expect(component.isDetailsModalOpen).toBeTrue();
  });

  it('closeDetails should clear selectedTask and close details modal', () => {
    initWithGetTasksSuccess();

    component.selectedTask = mockGroupedTasks.DOING[0];
    component.isDetailsModalOpen = true;

    component.closeDetails();

    expect(component.selectedTask).toBeNull();
    expect(component.isDetailsModalOpen).toBeFalse();
  });

  it('onCreateTask should add task to list, close modal and show success toast on success', () => {
    initWithGetTasksSuccess();

    const dto: CreateTaskDto = {
      title: 'New Task',
      description: 'New Desc',
      limitDate: '2025-02-01',
    };

    const createdTask: Task = {
      id: 4,
      status: 'TODO',
      createdAt: '',
      updatedAt: '',
      ...dto,
    };

    taskServiceMock.createTask.and.returnValue(of(createdTask));

    const initialTodoCount = component.tasks.TODO.length;
    component.isNewTaskModalOpen = true;

    component.onCreateTask(dto);

    expect(taskServiceMock.createTask).toHaveBeenCalledWith(dto);
    expect(component.tasks.TODO.length).toBe(initialTodoCount + 1);
    expect(component.tasks.TODO[component.tasks.TODO.length - 1]).toEqual(
      createdTask
    );
    expect(component.isNewTaskModalOpen).toBeFalse();
    expect(toastServiceMock.success).toHaveBeenCalledWith('Task created');
  });

  it('onCreateTask should show specific error toast when title is missing', () => {
    initWithGetTasksSuccess();

    const dto: CreateTaskDto = {
      title: '',
      description: 'Desc',
      limitDate: '2025-02-01',
    };

    const apiError = {
      error: { title: 'Title is required' },
    };

    taskServiceMock.createTask.and.returnValue(
      throwError(() => apiError as any)
    );

    component.onCreateTask(dto);

    expect(taskServiceMock.createTask).toHaveBeenCalledWith(dto);
    expect(toastServiceMock.error).toHaveBeenCalledWith(
      'Please fill in task title'
    );
  });

  it('onCreateTask should show generic error toast on unknown error', () => {
    initWithGetTasksSuccess();

    const dto: CreateTaskDto = {
      title: 'Any',
      description: 'Desc',
      limitDate: '2025-02-01',
    };

    taskServiceMock.createTask.and.returnValue(
      throwError(() => ({ error: {} } as any))
    );

    component.onCreateTask(dto);

    expect(taskServiceMock.createTask).toHaveBeenCalledWith(dto);
    expect(toastServiceMock.error).toHaveBeenCalledWith(
      'Error to create a task'
    );
  });

  it('onUpdateTask should update task in list, close modal and show success toast on success', () => {
    initWithGetTasksSuccess();

    const existingTask = mockGroupedTasks.DOING[0];
    component.tasks = {
      TODO: [...mockGroupedTasks.TODO],
      DOING: [existingTask],
      DONE: [...mockGroupedTasks.DONE],
    };

    component.selectedTask = existingTask;
    component.isDetailsModalOpen = true;

    const dto: UpdateTaskDto = {
      title: 'Updated Title',
      description: 'Updated Desc',
      limitDate: '2025-05-05',
    };

    const updatedTask: Task = {
      ...existingTask,
      ...dto,
    };

    taskServiceMock.updateTask.and.returnValue(of(updatedTask));

    component.onUpdateTask({ id: existingTask.id, dto });

    expect(taskServiceMock.updateTask).toHaveBeenCalledWith(
      existingTask.id,
      dto
    );

    const updatedList = component.tasks.DOING;
    const found = updatedList.find((t) => t.id === updatedTask.id);

    expect(found).toEqual(updatedTask);
    expect(component.selectedTask).toEqual(updatedTask);
    expect(component.isDetailsModalOpen).toBeFalse();
    expect(toastServiceMock.success).toHaveBeenCalledWith('Task updated');
  });

  it('onUpdateTask should show error toast on failure', () => {
    initWithGetTasksSuccess();

    const existingTask = mockGroupedTasks.TODO[0];
    component.tasks = mockGroupedTasks;
    component.selectedTask = existingTask;

    const dto: UpdateTaskDto = {
      title: 'Updated',
      description: 'Updated',
      limitDate: '2025-05-05',
    };

    taskServiceMock.updateTask.and.returnValue(
      throwError(() => new Error('Update failed'))
    );

    component.onUpdateTask({ id: existingTask.id, dto });

    expect(taskServiceMock.updateTask).toHaveBeenCalledWith(
      existingTask.id,
      dto
    );
    expect(toastServiceMock.error).toHaveBeenCalledWith(
      'Error to update a task'
    );
  });

  it('onDeleteTask should remove task from list, close modal and show success toast on success', () => {
    initWithGetTasksSuccess();

    const existingTask = mockGroupedTasks.DONE[0];

    component.tasks = {
      TODO: [...mockGroupedTasks.TODO],
      DOING: [...mockGroupedTasks.DOING],
      DONE: [existingTask],
    };
    component.selectedTask = existingTask;
    component.isDetailsModalOpen = true;

    taskServiceMock.deleteTask.and.returnValue(of(existingTask));

    component.onDeleteTask({ id: existingTask.id });

    expect(taskServiceMock.deleteTask).toHaveBeenCalledWith(existingTask.id);
    expect(
      component.tasks.DONE.find((t) => t.id === existingTask.id)
    ).toBeUndefined();
    expect(component.isDetailsModalOpen).toBeFalse();
    expect(toastServiceMock.success).toHaveBeenCalledWith('Task deleted');
  });

  it('onDeleteTask should show error toast on failure', () => {
    initWithGetTasksSuccess();

    const existingTask = mockGroupedTasks.TODO[0];
    component.tasks = mockGroupedTasks;
    component.selectedTask = existingTask;

    taskServiceMock.deleteTask.and.returnValue(
      throwError(() => new Error('Delete failed'))
    );

    component.onDeleteTask({ id: existingTask.id });

    expect(taskServiceMock.deleteTask).toHaveBeenCalledWith(existingTask.id);
    expect(toastServiceMock.error).toHaveBeenCalledWith(
      'Error to delete a task'
    );
  });
});

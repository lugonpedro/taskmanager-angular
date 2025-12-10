import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskModalComponent } from './add-task-modal.component';
import { CreateTaskDto } from '../../services/task.interfaces';
import { TaskService } from '../../services/task.service';

describe('AddTaskModalComponent', () => {
  let component: AddTaskModalComponent;
  let fixture: ComponentFixture<AddTaskModalComponent>;
  let taskServiceMock: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    taskServiceMock = jasmine.createSpyObj<TaskService>('TaskService', [
      'getTasks',
      'createTask',
      'updateTask',
      'deleteTask',
      'updateTaskStatus',
    ]);

    await TestBed.configureTestingModule({
      imports: [AddTaskModalComponent],
      providers: [{ provide: TaskService, useValue: taskServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct initial state', () => {
    expect(component.loading).toBeFalse();
    expect(component.visible).toBeFalse();
    expect(component.newTask).toEqual({
      title: '',
      date: '',
      description: '',
    });
  });

  it('resetForm should clear newTask fields', () => {
    component.newTask = {
      title: 'Title',
      date: '2025-01-01',
      description: 'Desc',
    };

    component.resetForm();

    expect(component.newTask).toEqual({
      title: '',
      date: '',
      description: '',
    });
  });

  it('onOverlayClick should reset form and emit close', () => {
    component.newTask = {
      title: 'Title',
      date: '2025-01-01',
      description: 'Desc',
    };
    const closeSpy = spyOn(component.close, 'emit');

    component.onOverlayClick();

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(component.newTask).toEqual({
      title: '',
      date: '',
      description: '',
    });
  });

  it('onModalClick should stop event propagation', () => {
    const stopPropagationSpy = jasmine.createSpy('stopPropagation');
    const event = { stopPropagation: stopPropagationSpy } as unknown as MouseEvent;

    component.onModalClick(event);

    expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
  });

  it('onCloseClick should reset form and emit close', () => {
    component.newTask = {
      title: 'Title',
      date: '2025-01-01',
      description: 'Desc',
    };
    const closeSpy = spyOn(component.close, 'emit');

    component.onCloseClick();

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(component.newTask).toEqual({
      title: '',
      date: '',
      description: '',
    });
  });

  it('addTask should emit create with correct dto and reset form', () => {
    component.newTask = {
      title: 'New Task',
      date: '2025-12-31',
      description: 'Important task',
    };
    const createSpy = spyOn(component.create, 'emit');

    component.addTask();

    const expectedDto: CreateTaskDto = {
      title: 'New Task',
      description: 'Important task',
      limitDate: '2025-12-31',
    };

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith(expectedDto);
    expect(component.newTask).toEqual({
      title: '',
      date: '',
      description: '',
    });
  });
});

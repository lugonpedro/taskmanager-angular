import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailsModalComponent } from './task-details-modal.component';
import { By } from '@angular/platform-browser';
import { Task } from '../../services/task.interfaces';

describe('TaskDetailsModalComponent', () => {
  let component: TaskDetailsModalComponent;
  let fixture: ComponentFixture<TaskDetailsModalComponent>;

  const baseTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Some description',
    status: 'TODO',
    limitDate: '2025-01-01',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-01-02T12:00:00Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailsModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function setVisibleWithTask(task: Task = baseTask) {
    component.visible = true;
    component.task = task;
    component.ngOnChanges();
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct initial state', () => {
    expect(component.isEditing).toBeFalse();
    expect(component.visible).toBeFalse();
    expect(component.task).toBeNull();
    expect(component.form).toEqual({
      title: '',
      description: '',
      limitDate: '',
    });
  });

  it('ngOnChanges should populate form when task is set', () => {
    component.task = baseTask;

    component.ngOnChanges();

    expect(component.form).toEqual({
      title: baseTask.title,
      description: baseTask.description as string,
      limitDate: baseTask.limitDate as string,
    });
  });

  it('ngOnChanges should handle null description and limitDate', () => {
    const task: Task = {
      ...baseTask,
      description: null as any,
      limitDate: null as any,
    };

    component.task = task;

    component.ngOnChanges();

    expect(component.form).toEqual({
      title: task.title,
      description: '',
      limitDate: '',
    });
  });

  it('onOverlayClick should emit close and reset isEditing', () => {
    setVisibleWithTask();
    component.isEditing = true;
    const closeSpy = spyOn(component.close, 'emit');

    component.onOverlayClick();

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(component.isEditing).toBeFalse();
  });

  it('onModalClick should stop event propagation', () => {
    const stopPropagationSpy = jasmine.createSpy('stopPropagation');
    const event = { stopPropagation: stopPropagationSpy } as unknown as MouseEvent;

    component.onModalClick(event);

    expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
  });

  it('startEdit should enable editing when task exists', () => {
    component.task = baseTask;

    component.startEdit();

    expect(component.isEditing).toBeTrue();
  });

  it('startEdit should do nothing when task is null', () => {
    component.task = null;

    component.startEdit();

    expect(component.isEditing).toBeFalse();
  });

  it('cancelEdit should disable editing and reset form to task values', () => {
    component.task = {
      ...baseTask,
      title: 'Original',
      description: 'Original desc',
      limitDate: '2025-02-02',
    };
    component.ngOnChanges();
    component.isEditing = true;
    component.form = {
      title: 'Changed',
      description: 'Changed desc',
      limitDate: '2025-03-03',
    };

    component.cancelEdit();

    expect(component.isEditing).toBeFalse();
    expect(component.form).toEqual({
      title: 'Original',
      description: 'Original desc',
      limitDate: '2025-02-02',
    });
  });

  it('cancelEdit should only disable editing when task is null', () => {
    component.task = null;
    component.isEditing = true;
    component.form = {
      title: 'Changed',
      description: 'Changed',
      limitDate: '2025-03-03',
    };

    component.cancelEdit();

    expect(component.isEditing).toBeFalse();
    expect(component.form).toEqual({
      title: 'Changed',
      description: 'Changed',
      limitDate: '2025-03-03',
    });
  });

  it('save should emit update with correct dto and disable editing', () => {
    const updateSpy = spyOn(component.update, 'emit');
    component.task = baseTask;
    component.ngOnChanges();
    component.isEditing = true;
    component.form = {
      title: 'Updated title',
      description: 'Updated desc',
      limitDate: '2025-05-05',
    };

    component.save();

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith({
      id: baseTask.id,
      dto: {
        title: 'Updated title',
        description: 'Updated desc',
        limitDate: '2025-05-05',
      },
    });
    expect(component.isEditing).toBeFalse();
  });

  it('save should do nothing when task is null', () => {
    const updateSpy = spyOn(component.update, 'emit');
    component.task = null;
    component.form = {
      title: 'Updated title',
      description: 'Updated desc',
      limitDate: '2025-05-05',
    };
    component.isEditing = true;

    component.save();

    expect(updateSpy).not.toHaveBeenCalled();
    expect(component.isEditing).toBeTrue();
  });

  it('deleteTask should emit delete with correct id and disable editing', () => {
    const deleteSpy = spyOn(component.delete, 'emit');
    component.task = baseTask;
    component.isEditing = true;

    component.deleteTask();

    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(deleteSpy).toHaveBeenCalledWith({ id: baseTask.id });
    expect(component.isEditing).toBeFalse();
  });

  it('deleteTask should do nothing when task is null', () => {
    const deleteSpy = spyOn(component.delete, 'emit');
    component.task = null;
    component.isEditing = true;

    component.deleteTask();

    expect(deleteSpy).not.toHaveBeenCalled();
    expect(component.isEditing).toBeTrue();
  });

  it('should render details view when visible and task are set and not editing', () => {
    setVisibleWithTask();

    const titleEl = fixture.debugElement.query(
      By.css('.details .detail-row .title')
    ).nativeElement as HTMLElement;

    expect(titleEl.textContent?.trim()).toBe(baseTask.title);
  });

  it('should render form when isEditing is true', () => {
    setVisibleWithTask();
    component.isEditing = true;
    fixture.detectChanges();

    const formEl = fixture.debugElement.query(By.css('form'));
    const titleInput = fixture.debugElement.query(
      By.css('input[name="title"]')
    );

    expect(formEl).not.toBeNull();
    expect(titleInput).not.toBeNull();
  });
});

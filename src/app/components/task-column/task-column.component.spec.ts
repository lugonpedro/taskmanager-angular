import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskColumnComponent } from './task-column.component';
import { By } from '@angular/platform-browser';

describe('TaskColumnComponent', () => {
  let component: TaskColumnComponent;
  let fixture: ComponentFixture<TaskColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskColumnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskColumnComponent);
    component = fixture.componentInstance;
    component.title = 'TODO';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct initial state', () => {
    expect(component.isAdding).toBeFalse();
    expect(component.newTitle).toBe('');
  });

  it('should render title', () => {
    const titleElement = fixture.debugElement.query(By.css('.title'))
      .nativeElement as HTMLElement;

    expect(titleElement.textContent?.trim()).toBe('TODO');
  });

  it('startAdding should set isAdding to true and clear newTitle', () => {
    component.newTitle = 'Something';
    component.isAdding = false;

    component.startAdding();

    expect(component.isAdding).toBeTrue();
    expect(component.newTitle).toBe('');
  });

  it('cancelAdding should set isAdding to false and clear newTitle', () => {
    component.newTitle = 'Something';
    component.isAdding = true;

    component.cancelAdding();

    expect(component.isAdding).toBeFalse();
    expect(component.newTitle).toBe('');
  });

  it('confirmAdd should not emit when title is empty or only spaces', () => {
    const addCardSpy = spyOn(component.addCard, 'emit');

    component.newTitle = '   ';
    component.isAdding = true;

    component.confirmAdd();

    expect(addCardSpy).not.toHaveBeenCalled();
    expect(component.isAdding).toBeTrue();
  });

  it('confirmAdd should emit addCard with trimmed title and reset state', () => {
    const addCardSpy = spyOn(component.addCard, 'emit');

    component.newTitle = '  New Task  ';
    component.isAdding = true;

    component.confirmAdd();

    expect(addCardSpy).toHaveBeenCalledTimes(1);
    expect(addCardSpy).toHaveBeenCalledWith('New Task');
    expect(component.isAdding).toBeFalse();
    expect(component.newTitle).toBe('');
  });

  it('clicking add button should call startAdding and show input', () => {
    const startAddingSpy = spyOn(component, 'startAdding').and.callThrough();

    let inputBefore = fixture.debugElement.query(By.css('.temp-card input'));
    expect(inputBefore).toBeNull();

    const addButton = fixture.debugElement.query(By.css('.add-btn'));
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(startAddingSpy).toHaveBeenCalledTimes(1);

    const inputAfter = fixture.debugElement.query(By.css('.temp-card input'));
    expect(inputAfter).not.toBeNull();
  });

  it('pressing Enter on input should call confirmAdd', () => {
    component.isAdding = true;
    component.newTitle = 'Task by Enter';
    fixture.detectChanges();

    const confirmAddSpy = spyOn(component, 'confirmAdd').and.callThrough();

    const input = fixture.debugElement.query(By.css('.temp-card input'));
    input.triggerEventHandler('keydown.enter', {});
    fixture.detectChanges();

    expect(confirmAddSpy).toHaveBeenCalledTimes(1);
  });

  it('pressing Escape on input should cancel adding and reset state', () => {
    component.isAdding = true;
    component.newTitle = 'Task';
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('.temp-card input'));
    input.triggerEventHandler('keydown.escape', {});
    fixture.detectChanges();

    expect(component.isAdding).toBeFalse();
    expect(component.newTitle).toBe('');
  });

  it('blurring input should cancel adding and reset state', () => {
    component.isAdding = true;
    component.newTitle = 'Task';
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('.temp-card input'));
    input.triggerEventHandler('blur', {});
    fixture.detectChanges();

    expect(component.isAdding).toBeFalse();
    expect(component.newTitle).toBe('');
  });
});

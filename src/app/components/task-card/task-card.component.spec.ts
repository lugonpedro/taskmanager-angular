import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCardComponent } from './task-card.component';
import { By } from '@angular/platform-browser';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    component.title = 'My Task';
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('.title'))
      .nativeElement as HTMLElement;

    expect(titleElement.textContent?.trim()).toBe('My Task');
  });

  it('should emit taskClick when card is clicked', () => {
    const emitSpy = spyOn(component.taskClick, 'emit');

    const card = fixture.debugElement.query(By.css('.task-card'));
    card.triggerEventHandler('click', null);

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should display date when limitDate is provided', () => {
    component.limitDate = '2025-01-15';
    fixture.detectChanges();

    const dateElement = fixture.debugElement.query(By.css('.date .text'))
      .nativeElement as HTMLElement;

    expect(dateElement.textContent?.trim()).toBe('15/01');
  });

  it('should not display date when limitDate is null', () => {
    component.limitDate = null;
    fixture.detectChanges();

    const dateElement = fixture.debugElement.query(By.css('.date'));
    expect(dateElement).toBeNull();
  });

  it('should not display date when limitDate is undefined', () => {
    component.limitDate = undefined as any;
    fixture.detectChanges();

    const dateElement = fixture.debugElement.query(By.css('.date'));
    expect(dateElement).toBeNull();
  });

  it('should display description icon when description is provided', () => {
    component.description = 'Some description';
    fixture.detectChanges();

    const descriptionElement = fixture.debugElement.query(
      By.css('.description')
    );
    expect(descriptionElement).not.toBeNull();
  });

  it('should not display description icon when description is null', () => {
    component.description = null;
    fixture.detectChanges();

    const descriptionElement = fixture.debugElement.query(
      By.css('.description')
    );
    expect(descriptionElement).toBeNull();
  });

  it('should not display description icon when description is an empty string', () => {
    component.description = '';
    fixture.detectChanges();

    const descriptionElement = fixture.debugElement.query(
      By.css('.description')
    );
    expect(descriptionElement).toBeNull();
  });
});

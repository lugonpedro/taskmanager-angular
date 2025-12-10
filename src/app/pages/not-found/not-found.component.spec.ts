import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundComponent } from './not-found.component';
import { By } from '@angular/platform-browser';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 404 title', () => {
    const h1 = fixture.debugElement.query(By.css('h1'))
      .nativeElement as HTMLElement;

    expect(h1.textContent?.trim()).toBe('404');
  });

  it('should render not found message', () => {
    const p = fixture.debugElement.query(By.css('p'))
      .nativeElement as HTMLElement;

    expect(p.textContent?.trim()).toBe('Not found');
  });
});

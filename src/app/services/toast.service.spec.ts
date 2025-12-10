import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ToastService', () => {
  let service: ToastService;
  let snackBarMock: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBarMock = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        ToastService,
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    });

    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('success should call MatSnackBar.open with success config', () => {
    const message = 'Success message';

    service.success(message);

    expect(snackBarMock.open).toHaveBeenCalledTimes(1);
    expect(snackBarMock.open).toHaveBeenCalledWith(message, '', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['app-snackbar', 'app-snackbar--success'],
    });
  });

  it('error should call MatSnackBar.open with error config', () => {
    const message = 'Error message';

    service.error(message);

    expect(snackBarMock.open).toHaveBeenCalledTimes(1);
    expect(snackBarMock.open).toHaveBeenCalledWith(message, '', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['app-snackbar', 'app-snackbar--error'],
    });
  });
});

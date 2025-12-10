import { AutofocusDirective } from './autofocus.directive';
import { ElementRef } from '@angular/core';

describe('AutofocusDirective', () => {
  it('should focus in ngAfterViewInit', () => {
    const focusSpy = jasmine.createSpy('focus');
    const elRef = { nativeElement: { focus: focusSpy } } as ElementRef;
    const directive = new AutofocusDirective(elRef);
    directive.ngAfterViewInit();
    expect(focusSpy).toHaveBeenCalled();
  });
});

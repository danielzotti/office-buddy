import { Directive, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[obAdminOnly]'
})
export class AdminOnlyDirective {

  constructor(
    private authService: AuthService,
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
    this.authService.isAdmin$.subscribe(isAdmin => {
        if(isAdmin) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      }
    );
  }

}

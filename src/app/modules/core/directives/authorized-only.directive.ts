import { Directive, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[obAuthorizedOnly]'
})
export class AuthorizedOnlyDirective {

  constructor(
    private authService: AuthService,
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
    this.authService.isAuthorized$.subscribe(isAuthorized => {
        if(isAuthorized) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      }
    );
  }

}

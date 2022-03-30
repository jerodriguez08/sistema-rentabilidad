import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPassGuard implements CanActivate {

  constructor( private router: Router) { }

  canActivate(): Observable<boolean> | boolean {

    if (!localStorage.getItem('email_recuperacion')) {
      this.router.navigate(['/auth/password/']);
      return false;
    }

    return true;
  }

}

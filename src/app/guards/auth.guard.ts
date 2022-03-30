import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
    ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      return this.authService.isAuthenticated()
      .pipe(
        tap(authenticated => {
          if (!authenticated){
            this.router.navigate(['./auth/login']);
          }
        })
      )
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

      return this.authService.isAuthenticated()
      .pipe(
        tap(authenticated => {
          if (!authenticated){
            this.router.navigate(['./auth/login']);
          }
        })
      )
  }
}

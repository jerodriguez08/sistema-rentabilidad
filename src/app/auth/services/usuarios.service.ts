import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario, Verificacion, AuthResponse } from '../interfaces/usuario.interface';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  // private apiUrl: string = 'http://localhost:3000/usuarios';
  // private apiUrl: string = 'http://localhost:5000';
  private apiUrl: string = environment.baseUrl;

  constructor(private http: HttpClient, private router: Router) { }

  // ------ Método para registrar a un usuario
  register(usuario: Usuario): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}/registrarse/`, usuario)
      .pipe(
        map(resp => {
          if(resp.status === 'Success'){
            this.saveInLocalStorage(usuario.correo!);
            this.router.navigateByUrl('/auth/register/verification');
            return resp;
          }
          return resp;
        }),
        catchError(error => {
          console.log('Error caught in service');
          console.error(error);
          return throwError(() => error);
        })
      )
  }

  saveInLocalStorage(email: string): void {
    localStorage.setItem('email', email);
  }

  // ------ Método para enviar código de verificación en el registro
  verificationCode(verificacion: Verificacion): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/registrarse/verificacion/`, verificacion)
      .pipe(
        map(resp => {
          if(resp.status === 'Success') {
            console.log(resp.message);
            this.router.navigateByUrl('/auth/register/registered');
            return resp;
          }else {
            return resp;
          }
        }),
        catchError(error => {
          console.log('Error caught in service');
          console.log(error);
          return throwError(() => error);
        })
      )
  }

  

}

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, Observable, of, map } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

import { Usuario, AuthResponse } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // urlBase: string = environment.baseUrl;
  urlBase: string = environment.baseUrl;
  private _currentUser: Usuario | undefined;

  get currentUser(): Usuario {
    return { ...this._currentUser! }
  }

  constructor(private http: HttpClient) { }

  // ------ Método para saber si el usuario ya se autentico, esto para el canActivate
  isAuthenticated(): Observable<boolean> {
    if (!localStorage.getItem('token')) {
      return of(false);
    } else {
      return of(true);
    }

    // return this.http.get(`${this.urlBase}/usuarios/1`)
    // .pipe(
    //   map(auth => {
    //     this._currentUser = auth;
    //     return true;
    //   })
    // );
  }

  // ------ Método para saber si los datos ingresados en el login son validos
  login(correo: string, clave: string) {
    const url = `${this.urlBase}/login/`;
    const body = { correo, clave };
    

    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap(auth => {
          if (auth.status === 'Success') {
            localStorage.setItem('token', auth.token!)
          }
        }),
        map(({ message, status }) => {
          if(message === 'Esta cuenta todavía no esta verificada en el sistema') {
            return { message, status: 'Validar' };
          }
          return { message, status };
        })
      );
  }

  // ------ Método para enviar el correo para la recuperacion de contraseña
  sendEmail(correo: string) {
    const url = `${this.urlBase}/recuperacion/`;
    const body = { correo };

    return this.http.post<AuthResponse>(url, body)
      .pipe(
        map(({ status, message }) => {
          if (status === 'Success') {
            localStorage.setItem('email_recuperacion', correo);
            return status;
          }
          else {
            return message;
          }
        })
      );
  }

  // ------ Método para enviar el código de verificación y saber si es válido o no
  verificateCode(codigo: string) {
    const url = `${this.urlBase}/recuperacion/validacion/`;
    const correo = localStorage.getItem('email_recuperacion');
    const body = { codigo, correo };

    return this.http.post<AuthResponse>(url, body)
      .pipe(
        map(({ message, status }) => {
          if (status === 'Success') {
            return status;
          } else {
            return message;
          }
        })
      );
  }

  // ------ Método para actualizar la contraseña
  updatePassword(clave: string, clave_confirmacion: string) {
    const url = `${this.urlBase}/recuperacion/nueva_contraseña/`;
    const correo = localStorage.getItem('email_recuperacion');
    const body = { clave, clave_confirmacion, correo };

    return this.http.post<AuthResponse>(url, body)
      .pipe(
        map(({ message, status }) => {
          if (status === 'Success') {
            localStorage.removeItem('email_recuperacion');
            return status;
          } else {
            return message;
          }
        })
      );
  }

}

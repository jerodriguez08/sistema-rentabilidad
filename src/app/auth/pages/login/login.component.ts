import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { delay, tap } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { ValidadoresService } from '../../services/validadores.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errors: ValidationErrors | null = null;
  errorResponse: string | undefined = undefined;
  activateRequired: boolean = false;

  formLogin: FormGroup = this.fb.group({
    email: ['prueba@test.com', [Validators.required, Validators.pattern(this.validate.emailPattern)]],
    password: ['123456aA', [Validators.required]]
  });


  constructor(
    private fb: FormBuilder,
    private router: Router,

    private authService: AuthService,
    private validate: ValidadoresService
  ) { }

  ngOnInit(): void {
  }

  // ------ Método para verificar si un campo pasado por parámtro es valido o no
  invalidField(field: string): boolean {
    if (this.formLogin.controls[field].invalid
      && this.formLogin.controls[field].touched) {

      const errors = this.formLogin.controls[field].errors;

      if (errors?.['required']) {
        this.formLogin.controls[field].setErrors({ 'msg': 'Este campo es obligatorio' });
      } else if (errors?.['pattern']) {
        this.formLogin.controls[field].setErrors({ 'msg': 'El correo parece no existir' });
      }

      return true;
    }

    return false;
  }

  // ------ Método que coloca los estilos al input dependiendo si tiene o no errores
  hasError(field: string): string {
    return (this.invalidField(field)) ? 'form-control border-danger' : 'form-control';
  }

  // ----- Método que se dispara con el Submit del formulario
  sendLogin(): void {
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }

    const email = this.formLogin.get('email')?.value;
    const pasword = this.formLogin.get('password')?.value;

    // ------ Mandar el Login al server
    this.authService.login(email, pasword)
      .pipe(
        tap(({ message, status }) => {
          if (status !== 'Success') {
            this.errorResponse = message;
          }
        }),
        delay(3000)
      )
      .subscribe(({ message, status }) => {
        if (status === 'Success') {
          this.router.navigate(['./auth/register']);
        }else if (status === 'Validar') {
          this.activateRequired = true;
          // return;
        }

        this.errorResponse = undefined;
        // console.log(this.errorResponse);
        
      });
  }
}

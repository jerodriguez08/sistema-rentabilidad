import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { min, tap, delay } from 'rxjs';
import { ValidadoresService } from '../../../../services/validadores.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  errorResponse: string | undefined = undefined;

  formConfPass: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=\\S+$).{8,255}$')]],
    confirmPassword: ['', [Validators.required]]
  },
    {
      validators: [this.validate.camposIguales('password', 'confirmPassword')]
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
    if (this.formConfPass.controls[field].invalid
      && this.formConfPass.controls[field].touched) {

      const errors = this.formConfPass.controls[field].errors;

      if (errors?.['required']) {
        this.formConfPass.controls[field].setErrors({ 'msg': 'Este campo es obligatorio' });
      } else if (errors?.['minlength']) {
        this.formConfPass.controls[field].setErrors({
          'msg': `La contraseña debe tener al menos ${errors?.['minlength']?.['requiredLength']} caracteres`
        });
      } else if (errors?.['pattern']) {
        this.formConfPass.controls[field].setErrors({ 'msg': 'Debe contener al menos una letra mayúscula, minúscula, al menos un número y ningún espacio' });
      } else if (errors?.['noIguales']) {
        this.formConfPass.controls[field].setErrors({ 'msg': 'Las contraseñas deben de ser iguales' });
      }

      return true;
    }

    return false;
  }

  // ------ Método que coloca los estilos al input dependiendo si tiene o no errores
  hasError(field: string): string {
    return (this.invalidField(field)) ? 'form-control border-danger' : 'form-control';
  }

  // ------ Método que se dispara al enviar el formulario "submit"
  sendNewPass(): void {
    if (this.formConfPass.invalid) {
      this.formConfPass.markAllAsTouched();
      return;
    }

    const pass1 = this.formConfPass.get('password')?.value;
    const pass2 = this.formConfPass.get('confirmPassword')?.value;

    this.authService.updatePassword(pass1, pass2)
      .pipe(
        tap(resp => {
          if (resp !== 'Success') {
            this.errorResponse = resp;
          }
        }),
        delay(3000)
      )
      .subscribe(resp => {
        if (resp === 'Success') {
          this.router.navigate(['auth/']);
        }

        this.errorResponse = undefined;
      });
  }
}

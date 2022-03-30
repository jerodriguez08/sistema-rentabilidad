import { Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.css']
})

export class VerificationCodeComponent implements OnInit, DoCheck {

  // Formulario
  formCode: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(7)]]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,

    private authService: AuthService
  ) { }

  ngDoCheck(): void {
  }

  ngOnInit(): void {
  }

  // ------ Método para verificar si un campo pasado por parámtro es valido o no
  invalidField(field: string): boolean {
    if (this.formCode.controls[field].invalid
      && this.formCode.controls[field].touched 
      || this.formCode.controls[field].errors) {

      const errors = this.formCode.controls[field].errors;

      if (errors?.['required']) {
        this.formCode.controls[field].setErrors({ 'msg': 'Este campo es obligatorio' });
      } else if (errors?.['minlength']) {
        this.formCode.controls[field].setErrors({ 'msg': 'El código no es válido' });
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
  sendCode(): void {
    if (this.formCode.invalid) {
      this.formCode.markAllAsTouched();
      return;
    }

    const code = this.formCode.get('code')?.value;

    this.authService.verificateCode(code)
      .subscribe(resp => {
        if (resp === 'Success') {
          this.router.navigate(['/auth/password/conf-password']);
        } else {
          this.formCode.controls['code'].setErrors({ 'msg': resp });
        }
      });

  }

}

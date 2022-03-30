import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ValidadoresService } from '../../../../services/validadores.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

   // ------ Formato correcto de un email
   emailFormat: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  msg: string = '';

  //  ------ Formulario
  formPassword: FormGroup = this.fb.group({
    email: ['prueba@mail.com', [Validators.required, Validators.pattern(this.validate.emailPattern)]]
  });

  constructor(
    private fb: FormBuilder,
    private router:Router,

    private authService: AuthService,
    private validate: ValidadoresService
    ) { }

  ngOnInit(): void {
  }

  // ------ Método para verificar si un campo pasado por parámtro es valido o no
  invalidField(field: string): boolean{
    if(this.formPassword.controls[field].invalid
        && this.formPassword.controls[field].touched
        || this.formPassword.controls[field].errors){

          const errors = this.formPassword.controls[field].errors;

          if(errors?.['required']){
            this.formPassword.controls[field].setErrors({'msg': 'Este campo es obligatorio'});
          }else if(errors?.['pattern']){
            this.formPassword.controls[field].setErrors({'msg': 'El correo parece no existir'});
          }

          return true;
    }
    
    return false;
  }

  // ------ Método que coloca los estilos al input dependiendo si tiene o no errores
  hasError(field: string): string{
    return (this.invalidField(field)) ? 'form-control border-danger' : 'form-control';
  }

  // ------ Método que se dispara al enviar el formulario "submit"
  sendEmail(): void{
    if(this.formPassword.invalid){
      this.formPassword.markAllAsTouched();
      return;
    }

    const email = this.formPassword.get('email')?.value;

    this.authService.sendEmail(email)
      .subscribe(resp => {
        if(resp === 'Success'){
          this.router.navigate(['auth/password/verification']);
        }else{
          this.formPassword.get('email')?.setErrors({'msg': resp})
        }
      });

  }
}

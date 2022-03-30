import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Verificacion } from 'src/app/auth/interfaces/usuario.interface';
import { UsuariosService } from 'src/app/auth/services/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.css']
})
export class VerificationCodeComponent implements OnInit {

  emailFromRegister = localStorage.getItem('email');
  // public subscription!: Subscription;

  verificacion: Verificacion = {
    correo: '',
    codigo: '',
  }

  miFormulario: FormGroup = this.fb.group({
    codigo: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]]
  });

  constructor(private fb: FormBuilder,
              private usuarioService: UsuariosService,
              private router: Router) { }

  ngOnInit(): void {
  
  }

  // ----- Método que se dispara con el Submit del formulario
  validateCode() {
    if(this.miFormulario.invalid){
      this.miFormulario.markAllAsTouched;
    }else {
      try {
        this.asignarValores();
        console.log(this.verificacion);
        this.usuarioService.verificationCode(this.verificacion)
          .subscribe(resp => {
            if(resp.status === 'Failure'){
              this.miFormulario.controls['codigo'].setErrors({'msg':resp.message});
              this.hasError('codigo'); 
            }
          });
      } catch (error) {
        console.log('No hay correo asignado a esta petición');
        this.router.navigateByUrl('/auth/register');
      }
    }
  }

  // ------ Método que coloca los estilos al input dependiendo si tiene o no errores
  hasError(field: string) {
    return (this.invalidField(field)) ? 'form-control border-danger' : 'form-control';
  }

  // ------ Método para verificar si un campo pasado por parámtro es valido o no
  invalidField(field: string) {
    if(this.miFormulario.controls[field].invalid && this.miFormulario.controls[field].touched){

      const errors = this.miFormulario.controls[field].errors;

      if(errors?.['required']) {
        this.miFormulario.controls[field].setErrors({'msg':'Este campo es obligatorio'});
      }else if(errors?.['maxlength']) {
        this.miFormulario.controls[field].setErrors(
          {'msg':`Este campo no debe tener más de ${errors?.['maxlength']?.['requiredLength']} caracteres`});
      }else if(errors?.['minlength']) {
        this.miFormulario.controls[field].setErrors(
          {'msg':`Este campo debe tener más de ${errors?.['minlength']?.['requiredLength']} caracteres`});
      }
      return true;
    }
    return false;
  }

  // ------ Método para guardar los valores en la propiedad codigo
  asignarValores() {
    this.verificacion.codigo = this.miFormulario.value.codigo.toUpperCase();
    this.verificacion.correo = this.emailFromRegister!.toString();
  }

}

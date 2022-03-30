import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/auth/interfaces/usuario.interface';
import { UsuariosService } from 'src/app/auth/services/usuarios.service';
import { ValidadoresService } from 'src/app/auth/services/validadores.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  correo!: string;
  emailBackError: boolean = false;
  puestos: string[] = ['PM','Desarrollo','QA Tester'];
  puestosNumber: string[] = ['1','2','3'];

  usuario: Usuario = {
    nombre: '',
    apellido_p: '',
    apellido_m: '',
    correo: '',
    clave: '',
    clave_confirmacion: '',
    puesto: '',
  }

  miFormulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(80)]],
    apPaterno: ['', [Validators.required, Validators.maxLength(40)]],
    apMaterno: ['', [Validators.required, Validators.maxLength(40)]],
    email: ['', [Validators.required, Validators.pattern(this.validadoresService.emailPattern)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255), Validators.pattern(this.validadoresService.passwordPattern)]],
    passwordConf: ['', [Validators.required]],
    puesto: ['', [Validators.required]]
  }, {
    validators: [this.validadoresService.camposIguales('password', 'passwordConf')]
  });

  constructor(private fb: FormBuilder, 
              private validadoresService: ValidadoresService,
              private usuariosService: UsuariosService) { }

  ngOnInit(): void {
  }

  // ----- Método que se dispara con el Submit del formulario
  register() {
    if(this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
    }else{
      this.asignarValores();

      this.usuariosService.register(this.usuario)
        .subscribe(resp => {
          if(resp.status === 'Failure'){
            this.miFormulario.controls['email'].setErrors({'msg':resp.message});
            this.miFormulario.markAllAsTouched();

            if(resp.message === 'Este correo ya está registrado pero no esta activada la cuenta.'){
              this.emailBackError = true;
            }
          }
        });
    }
  }

  // ------ Método que coloca los estilos al input dependiendo si tiene o no errores
  hasError(field: string): string {
    return (this.invalidField(field)) ? 'form-control border-danger' : 'form-control';
  }

  // ------ Método para verificar si un campo pasado por parámtro es valido o no
  invalidField(field: string) {
    if(this.miFormulario.controls[field].invalid && this.miFormulario.controls[field].touched) {

      const errors = this.miFormulario.controls[field].errors;

      if(errors?.['required']) {
        this.miFormulario.controls[field].setErrors({'msg':'Este campo es obligatorio'});
      }else if(errors?.['minlength']) {
        this.miFormulario.controls[field].setErrors(
          {'msg':`Este campo debe tener al menos ${errors?.['minlength']?.['requiredLength']} caracteres`});
      }else if(errors?.['maxlength']) {
        this.miFormulario.controls[field].setErrors(
          {'msg':`Este campo no debe tener más de ${errors?.['maxlength']?.['requiredLength']} caracteres`});
      }else if(errors?.['noIguales']) {
        this.miFormulario.controls[field].setErrors({'msg':'Las contraseñas deben coincidir'});
      }else if(errors?.['pattern']) {
        if(field === 'email'){
          this.miFormulario.controls[field].setErrors({'msg':'El valor ingresado no tiene formato de correo'});
        }else if(field === 'password'){
          this.miFormulario.controls[field].setErrors({'msg':'La contraseña debe contener al menos un número, una letra mayúscula y una minúscula'});
        }
      }
      return true;
    }
    return false;
  }

  // ------ Método para guardar los valores en la propiedad usuario
  asignarValores() {
    this.usuario.nombre = this.miFormulario.value.nombre;
    this.usuario.apellido_m = this.miFormulario.value.apMaterno;
    this.usuario.apellido_p = this.miFormulario.value.apPaterno;
    this.usuario.correo = this.miFormulario.value.email;
    this.usuario.clave = this.miFormulario.value.password;
    this.usuario.clave_confirmacion = this.miFormulario.value.passwordConf;
    this.usuario.puesto = this.miFormulario.value.puesto;
    this.correo = this.miFormulario.value.email;
  }

}

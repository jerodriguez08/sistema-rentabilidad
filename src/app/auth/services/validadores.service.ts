import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  // ------ Formato email valido
  public emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public passwordPattern: string = "(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,255}";


  constructor() { }

  // ------ Método para validar contraseñas iguales
  camposIguales(campo1: string, campo2: string){
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const field1 = formGroup.get(campo1)?.value;
      const field2 = formGroup.get(campo2)?.value;

      if(field1 !== field2) {
        formGroup.get(campo2)?.setErrors({noIguales: true});
        return {noIguales: true}
      }else if(field1 === field2 && field1.length === 0){
        formGroup.get(campo2)?.setErrors({required: true});
        return {noIguales: true}
      }
      
      if(field2.length > 0){
        formGroup.get(campo2)?.setErrors(null);
      }
      return null;
    }
  }
}

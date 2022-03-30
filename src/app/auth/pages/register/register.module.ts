import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './pages/register/register.component';
import { RegisteredComponent } from './pages/registered/registered.component';
import { VerificationCodeComponent } from './pages/verification-code/verification-code.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RegisterComponent,
    RegisteredComponent,
    VerificationCodeComponent
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    ReactiveFormsModule
  ]
})
export class RegisterModule { }

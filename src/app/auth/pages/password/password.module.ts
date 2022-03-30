import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordRoutingModule } from './password-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EmailComponent } from './pages/email/email.component';
import { PasswordComponent } from './pages/password/password.component';
import { VerificationCodeComponent } from './pages/verification-code/verification-code.component';


@NgModule({
  declarations: [
    EmailComponent,
    PasswordComponent,
    VerificationCodeComponent
  ],
  imports: [
    CommonModule,
    PasswordRoutingModule,
    ReactiveFormsModule
  ]
})
export class PasswordModule { }

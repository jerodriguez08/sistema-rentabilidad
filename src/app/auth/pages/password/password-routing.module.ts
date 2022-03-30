import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanLoad } from '@angular/router';
import { EmailComponent } from './pages/email/email.component';
import { PasswordComponent } from './pages/password/password.component';
import { VerificationCodeComponent } from './pages/verification-code/verification-code.component';
import { ResetPassGuard } from '../../../guards/reset-pass.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: EmailComponent },
      { path: 'verification', component: VerificationCodeComponent, canActivate: [ResetPassGuard] },
      { path: 'conf-password', component: PasswordComponent, canActivate: [ResetPassGuard] },
      { path: '**', redirectTo: '' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasswordRoutingModule { }

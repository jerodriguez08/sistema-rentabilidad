import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { RegisteredComponent } from './pages/registered/registered.component';
import { VerificationCodeComponent } from './pages/verification-code/verification-code.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: RegisterComponent },
      { path: 'verification', component: VerificationCodeComponent },
      { path: 'registered', component: RegisteredComponent },
      { path: '**', redirectTo: '' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }

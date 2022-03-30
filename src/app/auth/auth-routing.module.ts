import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'login', component: LoginComponent },

      { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule) },
      { path: 'password', loadChildren: () => import('./pages/password/password.module').then(m => m.PasswordModule) },
      { path: '**', redirectTo: 'login' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

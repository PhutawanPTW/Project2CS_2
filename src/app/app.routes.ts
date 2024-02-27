import { Routes } from '@angular/router';
import { LoginComponent } from './pages/main/login/login.component';
import { SignUpComponent } from './pages/main/sign-up/sign-up.component';
import { MainComponent } from './pages/main/main.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect empty path to login
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent },
];

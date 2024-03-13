import { Routes } from '@angular/router';
import { LoginComponent } from './pages/main/login/login.component';
import { SignUpComponent } from './pages/main/sign-up/sign-up.component';
import { MainComponent } from './pages/main/main.component';
import { ProfileComponent } from './pages/main/profile/profile.component';
import { Top10Component } from './pages/main/top10/top10.component';
import { ChartComponent } from './pages/main/chart/chart.component';

export const routes: Routes = [
  { path: '', component: MainComponent}, // Redirect empty path to login
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'top10', component: Top10Component },
  { path: 'chart/:id', component: ChartComponent },
];

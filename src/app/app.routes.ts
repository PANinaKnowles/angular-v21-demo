import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/weather',
    pathMatch: 'full'
  },
  {
    path: 'weather',
    loadComponent: () => import('./weather/weather.component').then(m => m.WeatherComponent)
  }
];

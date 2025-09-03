import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { BuilderComponent } from './pages/builder/builder.component';
import { ContentComponent } from './pages/builder/subpages/content/content.component';
import { CustomizeComponent } from './pages/builder/subpages/customize/customize.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'builder',
    component: BuilderComponent,
    children: [
      {
        path: '',
        redirectTo: 'content',
        pathMatch: 'full', // Đảm bảo khớp toàn bộ đường dẫn
      },
      {
        path: 'content',
        component: ContentComponent,
      },
      {
        path: 'customize',
        component: CustomizeComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
];

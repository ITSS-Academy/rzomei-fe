import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { BuilderComponent } from './pages/builder/builder.component';
import { ContentComponent } from './pages/builder/subpages/content/content.component';
import { CustomizeComponent } from './pages/builder/subpages/customize/customize.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SharePageComponent } from './pages/share-page/share-page.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'builder/:id',
    component: BuilderComponent,
    children: [
      {
        path: 'content',
        component: ContentComponent,
      },
      // {
      //   path: 'customize',
      //   component: CustomizeComponent,
      // },
    ],
  },
  {
    path: 'share/:id',
    component: SharePageComponent,
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
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];

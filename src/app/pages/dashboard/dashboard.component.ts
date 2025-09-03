import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material/material.module';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './dashboard-components/header/header.component';
import { CardCvComponent } from './dashboard-components/card-cv/card-cv.component';
import { ListCardCvComponent } from './dashboard-components/list-card-cv/list-card-cv.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MaterialModule,
    HeaderComponent,
    CardCvComponent,
    ListCardCvComponent,
    FormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  viewMode: 'grid' | 'list' = 'grid';
}

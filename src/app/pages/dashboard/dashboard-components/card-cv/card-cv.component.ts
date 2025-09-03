import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { MaterialModule } from '../../../../shared/material/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-cv',
  imports: [MaterialModule,CommonModule],
  templateUrl: './card-cv.component.html',
  styleUrl: './card-cv.component.scss',
})
export class CardCvComponent {
  @Input() title = 'Demo';
  @Input() template = 'templates_demo_form_resume_1';
  @Input() viewMode: 'grid' | 'list' = 'grid';
}

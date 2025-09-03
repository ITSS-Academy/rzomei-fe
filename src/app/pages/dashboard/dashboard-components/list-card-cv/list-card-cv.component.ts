import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material/material.module';

@Component({
  selector: 'app-list-card-cv',
  imports: [MaterialModule, CommonModule],
  templateUrl: './list-card-cv.component.html',
  styleUrl: './list-card-cv.component.scss',
})
export class ListCardCvComponent {
  @Input() title = 'Demo';
  @Input() template = 'templates_demo_form_resume_1';
  @Input() createdAt = new Date('2025-08-12');
  @Input() updatedAt = new Date('2025-08-12');
}

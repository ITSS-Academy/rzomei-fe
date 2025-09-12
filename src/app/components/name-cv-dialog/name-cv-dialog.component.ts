import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';

@Component({
  selector: 'app-name-cv-dialog',
  imports: [MaterialModule],
  templateUrl: './name-cv-dialog.component.html',
  styleUrl: './name-cv-dialog.component.scss',
})
export class NameCvDialogComponent {
  constructor() {}
  cvName = '';
}

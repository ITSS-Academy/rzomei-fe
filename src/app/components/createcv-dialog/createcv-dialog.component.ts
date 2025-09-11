import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-createcv-dialog',
  imports: [MaterialModule, SlickCarouselModule],
  templateUrl: './createcv-dialog.component.html',
  styleUrl: './createcv-dialog.component.scss',
})
export class CreatecvDialogComponent {
  themes = [
    { label: 'black-white' },
    { label: 'black-white' },
    { label: 'black-white' },
    { label: 'black-white' },
    { label: 'black-white' },
    { label: 'black-white' },
    { label: 'black-white' },
    { label: 'black-white' },
    // Thêm các theme khác nếu có
  ];
  selectedThemeIndex = 0;

  selectTheme(index: number) {
    this.selectedThemeIndex = index;
  }
}

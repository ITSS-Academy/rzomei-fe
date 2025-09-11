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
    { label: 'Classic', desc: 'Giao diện truyền thống' },
    { label: 'Modern', desc: 'Giao diện hiện đại' },
    { label: 'Minimal', desc: 'Giao diện tối giản' },
    { label: 'Classic', desc: 'Giao diện truyền thống' },
    { label: 'Modern', desc: 'Giao diện hiện đại' },
    { label: 'Minimal', desc: 'Giao diện tối giản' },
    { label: 'Classic', desc: 'Giao diện truyền thống' },
    { label: 'Modern', desc: 'Giao diện hiện đại' },
    { label: 'Minimal', desc: 'Giao diện tối giản' },
    // Thêm các theme khác nếu có
  ];
  selectedThemeIndex = 0;

  selectTheme(index: number) {
    this.selectedThemeIndex = index;
  }

  prevTheme() {
    if (this.selectedThemeIndex > 0) {
      this.selectedThemeIndex--;
    }
  }

  nextTheme() {
    if (this.selectedThemeIndex < this.themes.length - 1) {
      this.selectedThemeIndex++;
    }
  }
}

import { Component, ElementRef, ViewChild } from '@angular/core';
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
    { label: 'black-white' },
    { label: 'black-white' },
    { label: 'black-white' },
    { label: 'black-white' },

    // Thêm các theme khác nếu có
  ];
  selectedThemeIndex = 0;

  // selectTheme(index: number) {
  //   this.selectedThemeIndex = index;
  // }

  @ViewChild('carousel', { static: false })
  carouselRef!: ElementRef<HTMLDivElement>;

  scrollCarousel(direction: number) {
    const el = this.carouselRef?.nativeElement;
    if (el) {
      el.scrollBy({ left: direction * 200, behavior: 'smooth' });
    }
  }

  ngAfterViewInit() {
    if (this.carouselRef) {
      this.carouselRef.nativeElement.addEventListener(
        'wheel',
        (event: WheelEvent) => {
          if (event.deltaY !== 0) {
            event.preventDefault();
            this.carouselRef.nativeElement.scrollLeft += event.deltaY;
          }
        },
        { passive: false }
      );
    }
  }
}

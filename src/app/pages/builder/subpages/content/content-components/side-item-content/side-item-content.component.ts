import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../../../shared/material/material.module';
import { CvSectionState } from '../../../../../../ngrx/cv-section/cv-section.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SectionFormComponent } from '../section-forms/section-form.component';

@Component({
  selector: 'app-side-item-content',
  imports: [MaterialModule, AsyncPipe, SectionFormComponent],
  templateUrl: './side-item-content.component.html',
  styleUrl: './side-item-content.component.scss',
})
export class SideItemContentComponent {

  cvSections$!: Observable<any>

  constructor(private store: Store<{cvSections: CvSectionState}>) {
    this.cvSections$ = this.store.select('cvSections', 'sections');
    this.cvSections$.subscribe(data => {
      console.log(data);
    })
  }
}

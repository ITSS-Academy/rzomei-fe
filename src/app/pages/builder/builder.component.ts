import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/material/material.module';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { CvSectionState } from '../../ngrx/cv-section/cv-section.state';
import { AsyncPipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-builder',
  imports: [NavbarComponent, RouterModule, MaterialModule, AsyncPipe],
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent {


  generatedCv$!: Observable<any>;
  safeHtml!: SafeHtml;
  constructor(private store: Store<{cvSections: CvSectionState}>, private sanitizer: DomSanitizer) {
    this.generatedCv$ = this.store.select('cvSections', 'generatedCv');
    this.generatedCv$.subscribe(data => {
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(data);
    })
  }
}

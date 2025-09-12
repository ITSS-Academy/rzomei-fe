import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material/material.module';
import { SideItemContentComponent } from './content-components/side-item-content/side-item-content.component';
import { Observable } from 'rxjs';
import { CvSectionState } from '../../../../ngrx/cv-section/cv-section.state';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../../ngrx/auth/auth.state';
import * as CvSectionActions from '../../../../ngrx/cv-section/cv-section.actions';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  imports: [
    CommonModule,
    MaterialModule,
    SideItemContentComponent,
    NgxSkeletonLoaderModule,
  ],
})
export class ContentComponent implements OnInit {
  isLoading$!: Observable<boolean>;
  cvId!: number;

  constructor(
    private store: Store<{ cvSections: CvSectionState; auth: AuthState }>,
    private route: ActivatedRoute
  ) {
    this.isLoading$ = this.store.select('cvSections', 'isGetSectionLoading');
  }

  ngOnInit() {
    // Get CV ID from route params
    this.cvId = Number(this.route.parent?.snapshot.params['id']);
  
    // Debug loading state
    this.isLoading$.subscribe(loading => {
      // console.log('Is loading:', loading);
    });
  }
}

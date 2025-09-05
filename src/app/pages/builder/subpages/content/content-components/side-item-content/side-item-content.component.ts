import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../../../shared/material/material.module';
import { CvSectionState } from '../../../../../../ngrx/cv-section/cv-section.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {PersonalFormComponent} from '../section-forms/personal-form/personal-form.component';
import * as CvSectionActions from '../../../../../../ngrx/cv-section/cv-section.actions';
@Component({
  selector: 'app-side-item-content',
  imports: [MaterialModule, PersonalFormComponent],
  templateUrl: './side-item-content.component.html',
  styleUrl: './side-item-content.component.scss',
})
export class SideItemContentComponent implements OnInit {

  cvSections$!: Observable<any | null>
  blocks: any[] = []

  constructor(private store: Store<{cvSections: CvSectionState}>) {
    this.cvSections$ = this.store.select('cvSections', 'sections');
  }

  ngOnInit(): void {
    this.cvSections$.subscribe(data => {
      if(data){
        console.log(data);
        this.store.dispatch(CvSectionActions.generateCv({ data }));
        this.blocks = []
        for(let key of Object.keys(data)){
          const section = {
            type: key,
            content: data[key]
          }
          this.blocks.push(section);
        }
        console.log(this.blocks);
      }
    })
  }
}

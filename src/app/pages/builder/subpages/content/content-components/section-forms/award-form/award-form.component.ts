import { Component, OnDestroy, OnInit } from '@angular/core';
import { Award } from '../../../../../../../models/cv-block.model';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { CvSectionState } from '../../../../../../../ngrx/cv-section/cv-section.state';
import { updateCvById, updateCvSection } from '../../../../../../../ngrx/cv-section/cv-section.actions';
import { MaterialModule } from '../../../../../../../shared/material/material.module';
import { AwardFormEditComponent } from './award-form-edit.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-award-form',
  imports: [MaterialModule, AwardFormEditComponent, CommonModule],
  templateUrl: './award-form.component.html',
  styleUrl: './award-form.component.scss',
})
export class AwardFormComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  cvSections$!: Observable<Award[] | null>;
  awardForms: Award[] = [];
  currentEditingIndex: number | null = null; // Track index của form đang edit
  id = 0;

  constructor(
    private store: Store<{ cvSections: CvSectionState }>,
    private activatedRoute: ActivatedRoute
  ) {
    this.cvSections$ = this.store.select(
      (state) => state.cvSections.sections!.awards
    );
    this.id = this.activatedRoute.parent?.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.subscription.add(
      this.cvSections$.subscribe((data) => {
        if (data && data.length > 0) {
          this.awardForms = [...data];
        } else {
          // Initialize with empty array if no data
          this.awardForms = [];
        }
      })
    );
  }

  addForm(): void {
    // Thêm object rỗng
    const updatedForms = [...this.awardForms, {} as Award];
    // Dispatch action to save to store
    this.store.dispatch(
      updateCvSection({
        sectionType: 'awards',
        data: updatedForms,
      })
    );
    // Set editing index to the new form
    this.currentEditingIndex = updatedForms.length - 1;
  }

  updateForm(index: number, awardData: Award): void {
    const updatedForms = [...this.awardForms];
    updatedForms[index] = awardData;

    // Dispatch action to save to store
    this.store.dispatch(
      updateCvSection({
        sectionType: 'awards',
        data: updatedForms,
      })
    );
    this.store.dispatch(
            updateCvById({
              id: this.id,
              data: { awards: this.awardForms },
            })
          );
  }

  deleteForm(index: number): void {
    const updatedForms = this.awardForms.filter((_, i) => i !== index);

    // Dispatch action to save to store
    this.store.dispatch(
      updateCvSection({
        sectionType: 'awards',
        data: updatedForms,
      })
    );

    // Reset editing index if deleted form was being edited
    if (this.currentEditingIndex === index) {
      this.currentEditingIndex = null;
    } else if (
      this.currentEditingIndex !== null &&
      this.currentEditingIndex > index
    ) {
      this.currentEditingIndex--;
    }
  }

  onFormExpanded(index: number): void {
    // Close all other forms when one is expanded
    this.currentEditingIndex = index;
  }

  onFormCollapsed(index: number): void {
    if (this.currentEditingIndex === index) {
      this.currentEditingIndex = null;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

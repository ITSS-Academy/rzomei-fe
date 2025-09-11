import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../../../../shared/material/material.module';
import { Observable, Subscription } from 'rxjs';
import { Experience } from '../../../../../../../models/cv-block.model';
import { CvSectionState } from '../../../../../../../ngrx/cv-section/cv-section.state';
import { Store } from '@ngrx/store';
import { ExperienceFormEditComponent } from './experience-form-edit.component';
import {
  updateCvById,
  updateCvSection,
} from '../../../../../../../ngrx/cv-section/cv-section.actions';
import { CommonModule } from '@angular/common'; // Thêm CommonModule
import { ActivatedRoute } from '@angular/router';
import { E } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-experience-form',
  standalone: true, // Thêm standalone: true
  imports: [MaterialModule, ExperienceFormEditComponent, CommonModule], // Thêm CommonModule
  templateUrl: './experience-form.component.html',
  styleUrl: './experience-form.component.scss',
})
export class ExperienceFormComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  cvSections$!: Observable<Experience[] | null>;
  experienceForms: Experience[] = [];
  currentEditingIndex: number | null = null; // Track index của form đang edit
  id = 0;

  constructor(
    private store: Store<{ cvSections: CvSectionState }>,
    private activatedRoute: ActivatedRoute
  ) {
    this.cvSections$ = this.store.select(
      (state) => state.cvSections.sections!.experience
    );
    this.id = this.activatedRoute.parent?.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.subscription.add(
      this.cvSections$.subscribe((experienceData) => {
        if (experienceData && experienceData.length > 0) {
          this.experienceForms = [...experienceData];
        } else {
          // Initialize with empty array if no data
          this.experienceForms = [];
        }
      })
    );
  }

  addForm(): void {
    const last = this.experienceForms[this.experienceForms.length - 1];
    const isEmpty =
      last == null ||
      (typeof last === 'object' && Object.keys(last).length === 0);

    if (isEmpty) {
      // Nếu phần tử cuối là null hoặc object rỗng thì không thêm mới
      this.currentEditingIndex = this.experienceForms.length - 1;
      return;
    }

    // Thêm object rỗng mới
    const updatedForms = [...this.experienceForms, {} as Experience];
    this.store.dispatch(
      updateCvSection({
        sectionType: 'experience',
        data: updatedForms,
      })
    );
    this.store.dispatch(
      updateCvById({
        id: this.id,
        data: { interests: updatedForms },
      })
    );
    this.currentEditingIndex = updatedForms.length - 1;
  }

  updateForm(index: number, updatedData: Experience): void {
    if (index >= 0 && index < this.experienceForms.length) {
      const updatedForms = [...this.experienceForms];
      updatedForms[index] = { ...updatedData };
      // Trigger debounced save
      this.store.dispatch(
        updateCvSection({
          sectionType: 'experience',
          data: updatedForms,
        })
      );
    }
  }

  deleteForm(index: number): void {
    // Xử lý currentEditingIndex trước khi xóa phần tử
    if (this.currentEditingIndex === index) {
      this.currentEditingIndex = null;
    } else if (
      this.currentEditingIndex !== null &&
      this.currentEditingIndex > index
    ) {
      // Giảm index nếu xóa form ở trước
      this.currentEditingIndex--;
    }

    // Tạo bản sao mới từ mảng gốc
    const updatedForms = [...this.experienceForms];
    // Xóa chỉ một lần
    updatedForms.splice(index, 1);

    // Dispatch action trực tiếp
    this.store.dispatch(
      updateCvSection({
        sectionType: 'experience',
        data: updatedForms,
      })
    );

    this.store.dispatch(
      updateCvById({
        id: this.id,
        data: { experience: this.experienceForms },
      })
    );
  }

  // Handle khi một form được expand
  onFormExpanded(index: number): void {
    this.currentEditingIndex = index;
  }

  // Handle khi một form được collapse
  onFormCollapsed(index: number): void {
    if (this.currentEditingIndex === index) {
      this.currentEditingIndex = null;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

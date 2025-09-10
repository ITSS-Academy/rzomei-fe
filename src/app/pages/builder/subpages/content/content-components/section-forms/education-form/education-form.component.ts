import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../../../../shared/material/material.module';
import { Education } from '../../../../../../../models/cv-block.model';
import { Observable, Subscription, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { CvSectionState } from '../../../../../../../ngrx/cv-section/cv-section.state';
import { EducationFormEditComponent } from './education-form-edit.component';
import { CommonModule } from '@angular/common';
import { updateCvSection } from '../../../../../../../ngrx/cv-section/cv-section.actions';
import { updateCvById } from '../../../../../../../ngrx/cv-section/cv-section.actions';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-education-form',
  imports: [MaterialModule, EducationFormEditComponent, CommonModule],
  templateUrl: './education-form.component.html',
  styleUrl: './education-form.component.scss',
})
export class EducationFormComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  cvSections$!: Observable<Education[] | null>;
  educationForms: Education[] = [];
  currentEditingIndex: number | null = null; // Track index của form đang edit
  id = 0;

  constructor(
    private store: Store<{ cvSections: CvSectionState }>,
    private activatedRoute: ActivatedRoute
  ) {
    this.cvSections$ = this.store.select(
      (state) => state.cvSections.sections!.education
    );
    this.id = this.activatedRoute.parent?.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.subscription.add(
      this.cvSections$.subscribe((educationData) => {
        if (educationData && educationData.length > 0) {
          this.educationForms = [...educationData];
          this.store.dispatch(
            updateCvById({
              id: this.id,
              data: { education: this.educationForms },
            })
          );
        } else {
          // Initialize with empty array if no data
          this.educationForms = [];
        }
      })
    );
  }

  addForm(): void {
    // Thêm object rỗng
    const updatedForms = [...this.educationForms, {} as Education];
    // Dispatch action to save to store
    this.store.dispatch(
      updateCvSection({
        sectionType: 'education',
        data: updatedForms,
      })
    );
    // Set form mới này làm form đang edit (sau khi cập nhật giá trị)
    this.currentEditingIndex = updatedForms.length - 1;
  }

  updateForm(index: number, updatedData: Education): void {
    if (index >= 0 && index < this.educationForms.length) {
      const updatedForms = [...this.educationForms];
      updatedForms[index] = { ...updatedData };
      // Trigger debounced save
      this.store.dispatch(
        updateCvSection({
          sectionType: 'education',
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
    const updatedForms = [...this.educationForms];
    // Xóa chỉ một lần
    updatedForms.splice(index, 1);

    // Dispatch action trực tiếp
    this.store.dispatch(
      updateCvSection({
        sectionType: 'education',
        data: updatedForms,
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

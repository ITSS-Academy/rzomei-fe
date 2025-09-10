import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../../../../shared/material/material.module';
import { Observable, Subscription } from 'rxjs';
import { Interest } from '../../../../../../../models/cv-block.model';
import { CvSectionState } from '../../../../../../../ngrx/cv-section/cv-section.state';
import { Store } from '@ngrx/store';
import { InterestFormEditComponent } from './interest-form-edit.component';
import { updateCvById, updateCvSection } from '../../../../../../../ngrx/cv-section/cv-section.actions';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-interest-form',
  imports: [MaterialModule, InterestFormEditComponent, CommonModule],
  templateUrl: './interest-form.component.html',
  styleUrl: './interest-form.component.scss'
})
export class InterestFormComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  cvSections$!: Observable<Interest[] | null>;
  interestForms: Interest[] = [];
  currentEditingIndex: number | null = null; // Track index của form đang edit
  id = 0;

  constructor(private store: Store<{ cvSections: CvSectionState }>,
              private activatedRoute: ActivatedRoute) {
    this.cvSections$ = this.store.select(
      (state) => state.cvSections.sections!.interests
    );
    this.id = this.activatedRoute.parent?.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.subscription.add(
      this.cvSections$.subscribe((interestData) => {
        if (interestData && interestData.length > 0) {
          this.interestForms = [...interestData];
          this.store.dispatch(
            updateCvById({
              id: this.id,
              data: { interests: this.interestForms },
            })
          );
        } else {
          // Initialize with empty array if no data
          this.interestForms = [];
        }
      })
    );
  }

  addForm(): void {
    // Thêm object rỗng
    const updatedForms = [...this.interestForms, {} as Interest];
    // Dispatch action to save to store
    this.store.dispatch(
      updateCvSection({
        sectionType: 'interests',
        data: updatedForms,
      })
    );
    // Set form mới này làm form đang edit (sau khi cập nhật giá trị)
    this.currentEditingIndex = updatedForms.length - 1;
  }

  updateForm(index: number, updatedData: Interest): void {
    if (index >= 0 && index < this.interestForms.length) {
      const updatedForms = [...this.interestForms];
      updatedForms[index] = { ...updatedData };
      // Trigger debounced save
      this.store.dispatch(
        updateCvSection({
          sectionType: 'interests',
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
    const updatedForms = [...this.interestForms];
    // Xóa chỉ một lần
    updatedForms.splice(index, 1);

    // Dispatch action trực tiếp
    this.store.dispatch(
      updateCvSection({
        sectionType: 'interests',
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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../../../../shared/material/material.module';
import { Observable, Subscription } from 'rxjs';
import { Reference } from '../../../../../../../models/cv-block.model';
import { CvSectionState } from '../../../../../../../ngrx/cv-section/cv-section.state';
import { Store } from '@ngrx/store';
import { ReferenceFormEditComponent } from './reference-form-edit.component';
import {
  updateCvById,
  updateCvSection,
} from '../../../../../../../ngrx/cv-section/cv-section.actions';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reference-form',
  standalone: true,
  imports: [MaterialModule, ReferenceFormEditComponent, CommonModule],
  templateUrl: './reference-form.component.html',
  styleUrl: './reference-form.component.scss',
})
export class ReferenceFormComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  cvSections$!: Observable<Reference[] | null>;
  referenceForms: Reference[] = [];
  currentEditingIndex: number | null = null; // Track index của form đang edit
  id = 0;

  constructor(
    private store: Store<{ cvSections: CvSectionState }>,
    private activatedRoute: ActivatedRoute
  ) {
    this.cvSections$ = this.store.select(
      (state) => state.cvSections.sections!.references
    );
    this.id = this.activatedRoute.parent?.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.subscription.add(
      this.cvSections$.subscribe((referenceData) => {
        if (referenceData && referenceData.length > 0) {
          this.referenceForms = [...referenceData];
        } else {
          // Initialize with empty array if no data
          this.referenceForms = [];
        }
      })
    );
  }

  addForm(): void {
    const last = this.referenceForms[this.referenceForms.length - 1];
    const isEmpty =
      last == null ||
      (typeof last === 'object' && Object.keys(last).length === 0);

    if (isEmpty) {
      // Nếu phần tử cuối là null hoặc object rỗng thì không thêm mới
      this.currentEditingIndex = this.referenceForms.length - 1;
      return;
    }

    this.currentEditingIndex = this.referenceForms.length;
    const updatedForms = [...this.referenceForms, {} as Reference];
    this.store.dispatch(
      updateCvSection({
        sectionType: 'references',
        data: updatedForms,
      })
    );
    this.currentEditingIndex = updatedForms.length - 1;
  }

  updateForm(index: number, updatedData: Reference): void {
    if (index >= 0 && index < this.referenceForms.length) {
      const updatedForms = [...this.referenceForms];
      updatedForms[index] = { ...updatedData };
      // Trigger debounced save
      const filteredForms = updatedForms.filter((f) => f !== null);
      this.store.dispatch(
        updateCvSection({
          sectionType: 'references',
          data: filteredForms,
        })
      );

      this.store.dispatch(
        updateCvById({
          id: this.id,
          data: { references: this.referenceForms },
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
    const updatedForms = [...this.referenceForms];
    // Xóa chỉ một lần
    updatedForms.splice(index, 1);

    // Dispatch action trực tiếp
    this.store.dispatch(
      updateCvSection({
        sectionType: 'references',
        data: updatedForms,
      })
    );

    this.store.dispatch(
      updateCvById({
        id: this.id,
        data: { references: this.referenceForms },
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

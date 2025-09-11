import { Component, OnDestroy, OnInit } from '@angular/core';
import { Language } from '../../../../../../../models/cv-block.model';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { CvSectionState } from '../../../../../../../ngrx/cv-section/cv-section.state';
import {
  updateCvById,
  updateCvSection,
} from '../../../../../../../ngrx/cv-section/cv-section.actions';
import { MaterialModule } from '../../../../../../../shared/material/material.module';
import { LanguageFormEditComponent } from '../language-form/language-form-edit.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-language-form',
  imports: [MaterialModule, LanguageFormEditComponent, CommonModule],
  templateUrl: './language-form.component.html',
  styleUrl: './language-form.component.scss',
})
export class LanguageFormComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  cvSections$!: Observable<Language[] | null>;
  languageForms: Language[] = [];
  currentEditingIndex: number | null = null; // Track index của form đang edit
  id = 0;

  constructor(
    private store: Store<{ cvSections: CvSectionState }>,
    private activatedRoute: ActivatedRoute
  ) {
    this.cvSections$ = this.store.select(
      (state) => state.cvSections.sections!.languages
    );
    this.id = this.activatedRoute.parent?.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.subscription.add(
      this.cvSections$.subscribe((data) => {
        if (data && data.length > 0) {
          this.languageForms = [...data];
        } else {
          // Initialize with empty array if no data
          this.languageForms = [];
        }
      })
    );
  }

  addForm(): void {
    const last = this.languageForms[this.languageForms.length - 1];
    const isEmpty =
      last == null ||
      (typeof last === 'object' && Object.keys(last).length === 0);

    if (isEmpty) {
      // Nếu phần tử cuối là null hoặc object rỗng thì không thêm mới
      this.currentEditingIndex = this.languageForms.length - 1;
      return;
    }

    // Thêm object rỗng mới
    const updatedForms = [...this.languageForms, {} as Language];
    this.store.dispatch(
      updateCvSection({
        sectionType: 'languages',
        data: updatedForms,
      })
    );
    this.currentEditingIndex = updatedForms.length - 1;
  }

  updateForm(index: number, updatedData: Language): void {
    if (index >= 0 && index < this.languageForms.length) {
      const updatedForms = [...this.languageForms];
      updatedForms[index] = { ...updatedData };
      // Trigger debounced save
      this.store.dispatch(
        updateCvSection({
          sectionType: 'languages',
          data: updatedForms,
        })
      );
      this.store.dispatch(
        updateCvById({
          id: this.id,
          data: { languages: this.languageForms },
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
    const updatedForms = [...this.languageForms];
    // Xóa chỉ một lần
    updatedForms.splice(index, 1);

    // Dispatch action trực tiếp
    this.store.dispatch(
      updateCvSection({
        sectionType: 'languages',
        data: updatedForms,
      })
    );

    this.store.dispatch(
      updateCvById({
        id: this.id,
        data: { languages: this.languageForms },
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

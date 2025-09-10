import { Component, OnDestroy, OnInit } from '@angular/core';
import { Skill } from '../../../../../../../models/cv-block.model';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { CvSectionState } from '../../../../../../../ngrx/cv-section/cv-section.state';
import {
  updateCvById,
  updateCvSection,
} from '../../../../../../../ngrx/cv-section/cv-section.actions';
import { MaterialModule } from '../../../../../../../shared/material/material.module';
import { SkillFormEditComponent } from './skill-form-edit.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-skill-form',
  imports: [MaterialModule, SkillFormEditComponent, CommonModule],
  templateUrl: './skill-form.component.html',
  styleUrl: './skill-form.component.scss',
})
export class SkillFormComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  cvSections$!: Observable<Skill[] | null>;
  skillForms: Skill[] = [];
  currentEditingIndex: number | null = null; // Track index của form đang edit
  id = 0;

  constructor(
    private store: Store<{ cvSections: CvSectionState }>,
    private activatedRoute: ActivatedRoute
  ) {
    this.cvSections$ = this.store.select(
      (state) => state.cvSections.sections!.skills
    );
    this.id = this.activatedRoute.parent?.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.subscription.add(
      this.cvSections$.subscribe((data) => {
        if (data && data.length > 0) {
          this.skillForms = [...data];
        } else {
          // Initialize with empty array if no data
          this.skillForms = [];
        }
      })
    );
  }

  addForm(): void {
    // Thêm object rỗng
    const updatedForms = [...this.skillForms, {} as Skill];
    // Dispatch action to save to store
    this.store.dispatch(
      updateCvSection({
        sectionType: 'skills',
        data: updatedForms,
      })
    );
    // Set form mới này làm form đang edit (sau khi cập nhật giá trị)
    this.currentEditingIndex = updatedForms.length - 1;
  }

  updateForm(index: number, updatedData: Skill): void {
    if (index >= 0 && index < this.skillForms.length) {
      const updatedForms = [...this.skillForms];
      updatedForms[index] = { ...updatedData };
      // Trigger debounced save
      this.store.dispatch(
        updateCvSection({
          sectionType: 'skills',
          data: updatedForms,
        })
      );
                this.store.dispatch(
            updateCvById({
              id: this.id,
              data: { skills: this.skillForms },
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
    const updatedForms = [...this.skillForms];
    // Xóa chỉ một lần
    updatedForms.splice(index, 1);

    // Dispatch action trực tiếp
    this.store.dispatch(
      updateCvSection({
        sectionType: 'skills',
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

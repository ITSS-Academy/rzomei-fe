import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../../../../shared/material/material.module';
import { Observable, Subscription } from 'rxjs';
import { Organization } from '../../../../../../../models/cv-block.model';
import { CvSectionState } from '../../../../../../../ngrx/cv-section/cv-section.state';
import { Store } from '@ngrx/store';
import { updateCvById, updateCvSection } from '../../../../../../../ngrx/cv-section/cv-section.actions';
import { CommonModule } from '@angular/common';
import { OrganizationFormEditComponent } from './organization-form-edit.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-organization-form',
  standalone: true,
  imports: [MaterialModule, OrganizationFormEditComponent, CommonModule],
  templateUrl: './organization-form.component.html',
  styleUrl: './organization-form.component.scss',
})
export class OrganizationFormComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  cvSections$!: Observable<Organization[] | null>;
  organizationForms: Organization[] = [];
  currentEditingIndex: number | null = null; // Track index của form đang edit
  id = 0;

  constructor(private store: Store<{ cvSections: CvSectionState }>,
              private activatedRoute: ActivatedRoute) {
    this.cvSections$ = this.store.select(
      (state) => state.cvSections.sections!.organizations
    );
    this.id = this.activatedRoute.parent?.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.subscription.add(
      this.cvSections$.subscribe((organizationData) => {
        if (organizationData && organizationData.length > 0) {
          this.organizationForms = [...organizationData];
        } else {
          // Initialize with empty array if no data
          this.organizationForms = [];
        }
      })
    );
  }

  addForm(): void {
    // Thêm object rỗng
    const updatedForms = [...this.organizationForms, {} as Organization];
    // Dispatch action to save to store
    this.store.dispatch(
      updateCvSection({
        sectionType: 'organizations',
        data: updatedForms,
      })
    );
    // Set form mới này làm form đang edit (sau khi cập nhật giá trị)
    this.currentEditingIndex = updatedForms.length - 1;
  }

  updateForm(index: number, updatedData: Organization): void {
    if (index >= 0 && index < this.organizationForms.length) {
      const updatedForms = [...this.organizationForms];
      updatedForms[index] = { ...updatedData };
      // Trigger debounced save
      this.store.dispatch(
        updateCvSection({
          sectionType: 'organizations',
          data: updatedForms,
        })
      );
      this.store.dispatch(
            updateCvById({
              id: this.id,
              data: { organizations: this.organizationForms },
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
    const updatedForms = [...this.organizationForms];
    // Xóa chỉ một lần
    updatedForms.splice(index, 1);

    // Dispatch action trực tiếp
    this.store.dispatch(
      updateCvSection({
        sectionType: 'organizations',
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

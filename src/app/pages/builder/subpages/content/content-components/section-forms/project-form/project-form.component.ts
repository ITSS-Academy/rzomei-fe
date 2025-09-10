import { Component, OnDestroy, OnInit } from '@angular/core';
import { Project } from '../../../../../../../models/cv-block.model';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { CvSectionState } from '../../../../../../../ngrx/cv-section/cv-section.state';
import { updateCvById, updateCvSection } from '../../../../../../../ngrx/cv-section/cv-section.actions';
import { MaterialModule } from '../../../../../../../shared/material/material.module';
import { ProjectFormEditComponent } from './project-form-edit.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-form',
  imports: [MaterialModule, ProjectFormEditComponent, CommonModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  cvSections$!: Observable<Project[] | null>;
  projectForms: Project[] = [];
  currentEditingIndex: number | null = null; // Track index của form đang edit
  id = 0;

  constructor(private store: Store<{ cvSections: CvSectionState }>,
              private activatedRoute: ActivatedRoute) {
    this.cvSections$ = this.store.select(
      (state) => state.cvSections.sections!.projects
    );
    this.id = this.activatedRoute.parent?.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.subscription.add(
      this.cvSections$.subscribe((data) => {
        if (data && data.length > 0) {
          this.projectForms = [...data];
          this.store.dispatch(
            updateCvById({
              id: this.id,
              data: { projects: this.projectForms },
            })
          );
        } else {
          // Initialize with empty array if no data
          this.projectForms = [];
        }
      })
    );
  }

  addForm(): void {
    // Thêm object rỗng
    const updatedForms = [...this.projectForms, {} as Project];
    // Dispatch action to save to store
    this.store.dispatch(
      updateCvSection({
        sectionType: 'projects',
        data: updatedForms,
      })
    );
    // Set editing index to the new form
    this.currentEditingIndex = updatedForms.length - 1;
  }

  updateForm(index: number, projectData: Project): void {
    const updatedForms = [...this.projectForms];
    updatedForms[index] = projectData;

    // Dispatch action to save to store
    this.store.dispatch(
      updateCvSection({
        sectionType: 'projects',
        data: updatedForms,
      })
    );
  }

  deleteForm(index: number): void {
    const updatedForms = this.projectForms.filter((_, i) => i !== index);
    
    // Dispatch action to save to store
    this.store.dispatch(
      updateCvSection({
        sectionType: 'projects',
        data: updatedForms,
      })
    );

    // Reset editing index if deleted form was being edited
    if (this.currentEditingIndex === index) {
      this.currentEditingIndex = null;
    } else if (this.currentEditingIndex !== null && this.currentEditingIndex > index) {
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

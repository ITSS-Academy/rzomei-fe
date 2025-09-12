import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { PersonalInfo } from '../../../../../../../models/cv-block.model';
import { Store } from '@ngrx/store';
import { CvSectionState } from '../../../../../../../ngrx/cv-section/cv-section.state';
import * as CvActions from '../../../../../../../ngrx/cv-section/cv-section.actions';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MaterialModule } from '../../../../../../../shared/material/material.module';
import { AuthState } from '../../../../../../../ngrx/auth/auth.state';
import { ActivatedRoute } from '@angular/router';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-personal-form',
  imports: [
    ReactiveFormsModule,
    NgClass,
    MaterialModule,
    NgIf,
    FormsModule,
    NgxEditorModule,
  ],
  templateUrl: './personal-form.component.html',
  styleUrl: './personal-form.component.scss',
})
export class PersonalFormComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  cvSections$!: Observable<PersonalInfo | null>;

  summarySection$!: Observable<string | null>;

  cvSectionUpdate$!: Observable<any>;
  isEditing = false; // Flag to control editing mode
  id = 0;

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h4', 'h5'] }],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  // Form Controls
  nameFormControl = new FormControl('');
  summaryFormControl = new FormControl('');
  titleFormControl = new FormControl('');
  emailFormControl = new FormControl('');
  phoneFormControl = new FormControl('');
  locationFormControl = new FormControl('');
  websiteFormControl = new FormControl('');
  linkedinFormControl = new FormControl('');
  githubFormControl = new FormControl('');
  avatarFormControl = new FormControl('');
  avatarPreview: string | null = null;

  // Summary riêng biệt (không nằm trong personalInfo)

  formGroup = new FormGroup({
    name: this.nameFormControl,
    title: this.titleFormControl,
    email: this.emailFormControl,
    phone: this.phoneFormControl,
    location: this.locationFormControl,
    website: this.websiteFormControl,
    linkedin: this.linkedinFormControl,
    github: this.githubFormControl,
    avatar: this.avatarFormControl,
  });

  formSummaryGroup = new FormGroup({
    summary: this.summaryFormControl,
  });

  constructor(
    private store: Store<{ cvSections: CvSectionState; auth: AuthState }>,
    private activatedRoute: ActivatedRoute
  ) {
    this.cvSections$ = this.store.select(
      (state) => state.cvSections.sections!.personalInfo
    );
    this.summarySection$ = this.store.select(
      (state) => state.cvSections.sections!.summary
    );

    this.cvSectionUpdate$ = this.store.select((state) => state.cvSections);
    this.id = this.activatedRoute.parent?.snapshot.params['id'];
  }

  ngOnInit(): void {
    // Khởi tạo editor cho ngx-editor
    this.editor = new Editor();
    // Subscribe to personal info data and update form when data changes
    this.subscription.add(
      this.cvSections$.subscribe((personalInfo) => {
        if (personalInfo) {
          // Update form với dữ liệu từ store
          this.formGroup.patchValue({
            name: personalInfo.name || '',
            title: personalInfo.title || '',
            email: personalInfo.email || '',
            phone: personalInfo.phone || '',
            location: personalInfo.location || '',
            website: personalInfo.website || '',
            linkedin: personalInfo.linkedin || '',
            github: personalInfo.github || '',
            avatar: personalInfo.avatar || '',
          });
        }
      })
    );
    this.subscription.add(
      this.summarySection$.subscribe((summary) => {
        if (summary !== undefined && summary !== null) {
          this.formSummaryGroup.patchValue({
            summary: summary || '',
          });
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.editor) {
      this.editor.destroy();
    }
  }

  showData(): void {
    if (this.formGroup.valid) {
      const personalInfo: PersonalInfo = this.formGroup.value as PersonalInfo;
      console.log('Personal Info Data:', personalInfo);
      // TODO: Dispatch action to store
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched();
    }
  }

  resetForm(): void {
    this.formGroup.reset();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.formGroup.controls).forEach((key) => {
      const control = this.formGroup.get(key);
      control?.markAsTouched();
    });
  }
  updateSection() {
    this.store.dispatch(
      CvActions.updateCvSection({
        sectionType: 'personalInfo',
        data: this.formGroup.value,
      })
    );
    this.store.dispatch(
      CvActions.updateCvSection({
        sectionType: 'summary',
        data: this.formSummaryGroup.value,
      })
    );

    this.store.dispatch(
      CvActions.updateCvById({
        id: this.id,
        data: {
          personalInfo: this.formGroup.value,
          summary: this.formSummaryGroup.value.summary || null,
        },
      })
    );
    this.toggleEditMode();
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
  }
}

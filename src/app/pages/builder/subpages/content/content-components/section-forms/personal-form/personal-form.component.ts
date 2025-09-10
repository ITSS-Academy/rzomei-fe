import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {PersonalInfo} from '../../../../../../../models/cv-block.model';
import {Store} from '@ngrx/store';
import {CvSectionState} from '../../../../../../../ngrx/cv-section/cv-section.state';
import * as CvActions from '../../../../../../../ngrx/cv-section/cv-section.actions';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MaterialModule } from '../../../../../../../shared/material/material.module';
import { AuthState } from '../../../../../../../ngrx/auth/auth.state';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-personal-form',
    imports: [
    ReactiveFormsModule,
    NgClass,
    MaterialModule,
    NgIf,
],
  templateUrl: './personal-form.component.html',
  styleUrl: './personal-form.component.scss'
})
export class PersonalFormComponent implements OnInit, OnDestroy {

  private subscription = new Subscription();
  cvSections$!: Observable<PersonalInfo | null>;
  cvSectionUpdate$!: Observable<any>;
  isEditing = false; // Flag to control editing mode
  id = 0

  // Form Controls
  nameFormControl = new FormControl('');
  titleFormControl = new FormControl('');
  emailFormControl = new FormControl('');
  phoneFormControl = new FormControl('');
  locationFormControl = new FormControl('');
  summaryFormControl = new FormControl('');
  websiteFormControl = new FormControl('');
  linkedinFormControl = new FormControl('');
  githubFormControl = new FormControl('');
  avatarFormControl = new FormControl('');
  avatarPreview: string | null = null;

  formGroup = new FormGroup({
    name: this.nameFormControl,
    title: this.titleFormControl,
    email: this.emailFormControl,
    phone: this.phoneFormControl,
    location: this.locationFormControl,
    summary: this.summaryFormControl,
    website: this.websiteFormControl,
    linkedin: this.linkedinFormControl,
    github: this.githubFormControl,
    avatar: this.avatarFormControl
  });

  constructor(private store: Store<{ cvSections: CvSectionState, auth: AuthState }>, 
    private activatedRoute: ActivatedRoute
  ) {
    this.cvSections$ = this.store.select(state => state.cvSections.sections!.personalInfo);
    this.cvSectionUpdate$ = this.store.select(state => state.cvSections);
    this.id = this.activatedRoute.parent?.snapshot.params['id'];
  }

  ngOnInit(): void {
    // Subscribe to personal info data and update form when data changes
    this.subscription.add(
      this.cvSections$.subscribe(personalInfo => {
        if (personalInfo) {
          // Update form với dữ liệu từ store
          this.formGroup.patchValue({
            name: personalInfo.name || '',
            title: personalInfo.title || '',
            email: personalInfo.email || '',
            phone: personalInfo.phone || '',
            location: personalInfo.location || '',
            summary: personalInfo.summary || '',
            website: personalInfo.website || '',
            linkedin: personalInfo.linkedin || '',
            github: personalInfo.github || '',
            avatar: personalInfo.avatar || '',
          });
          this.store.dispatch(CvActions.updateCvById({ id: this.id, data: {
            personalInfo: this.formGroup.value
          } 
        }));
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    Object.keys(this.formGroup.controls).forEach(key => {
      const control = this.formGroup.get(key);
      control?.markAsTouched();
    });
  }

  updateSection() {
    this.store.dispatch(CvActions.updateCvSection({ sectionType: 'personalInfo', data: this.formGroup.value }));
    this.toggleEditMode(); // Exit edit mode after saving
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
      this.avatarFormControl.setValue(this.avatarPreview);
    };
    reader.readAsDataURL(file);
  }

  removeAvatar(): void {
    this.avatarPreview = null;
    this.avatarFormControl.setValue('');
  }
}

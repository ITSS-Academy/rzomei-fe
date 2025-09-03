import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../../../shared/material/material.module';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-personal-form',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="personal-info-section">
      <div class="upload-section">
        <!-- <h4>Ảnh Đại Diện</h4>
        <div class="upload-area">
          <div class="avatar-placeholder">
            <span>CV</span>
          </div>
          <div class="upload-controls">
            <button mat-stroked-button color="primary">
              <mat-icon>upload</mat-icon>
              Upload Image
            </button>
            <p class="upload-note">Supported: JPEG, PNG, JPG, WebP (Max 5MB)</p>
            <mat-form-field appearance="outline">
              <mat-label>Avatar URL</mat-label>
              <input
                matInput
                placeholder="https://..."
                [value]="data?.avatar || ''"
                (input)="updateData('avatar', $event)"
              />
              <mat-icon matPrefix>link</mat-icon>
            </mat-form-field>
          </div>
        </div>
      </div> -->

        <form class="example-form" [formGroup]="formGroup">
          <mat-form-field class="example-full-width">
            <mat-label>Email</mat-label>
            <input
              type="email"
              matInput
              [formControl]="emailFormControl"
              placeholder="Ex. pat@example.com"
            />
            @if (emailFormControl.hasError('email') &&
            !emailFormControl.hasError('required')) {
            <mat-error>Please enter a valid email address</mat-error>
            } @if (emailFormControl.hasError('required')) {
            <mat-error>Email is <strong>required</strong></mat-error>
            }
          </mat-form-field>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./section-forms.scss'],
})
export class PersonalFormComponent {
  constructor() {
    this.formGroup.addControl('email', this.emailFormControl);
  }
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  formGroup = new FormGroup({});
}

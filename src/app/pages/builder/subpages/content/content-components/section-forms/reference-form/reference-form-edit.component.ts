import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../../../../../../shared/material/material.module';
import { Reference } from '../../../../../../../models/cv-block.model';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CvDeleteConfirmDialogComponent } from '../../../../../../../components/cv-delete-confirm-dialog/cv-delete-confirm-dialog.component';

@Component({
  selector: 'app-reference-form-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  template: `
    <mat-expansion-panel
      class="reference-expansion-panel"
      [(expanded)]="isEditing"
      (expandedChange)="onExpansionChange()"
    >
      <mat-expansion-panel-header class="section-header">
        <mat-panel-title>
          <div class="panel-title-content">
            <span class="reference-name">{{
              referenceData?.name || 'Người tham chiếu'
            }}</span>
            <span
              class="reference-title"
              *ngIf="referenceData?.title && referenceData?.company"
              >{{
                referenceData!.title + ' tại ' + referenceData!.company
              }}</span
            >
          </div>
        </mat-panel-title>
        <mat-panel-description>
          <button
            mat-icon-button
            color="warn"
            (click)="onDelete(); $event.stopPropagation()"
            class="delete-btn"
            matTooltip="Xóa"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </mat-panel-description>
      </mat-expansion-panel-header>

      <!-- Edit Form Content -->
      <div class="edit-form-container">
        <form [formGroup]="formGroup" class="reference-form">
          <!-- Row 1: Name and Title -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Họ và tên</mat-label>
              <mat-icon matPrefix>person</mat-icon>
              <input
                matInput
                formControlName="name"
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Chức danh</mat-label>
              <mat-icon matPrefix>work</mat-icon>
              <input
                matInput
                formControlName="title"
                placeholder="Ví dụ: Trưởng phòng kỹ thuật"
              />
            </mat-form-field>
          </div>

          <!-- Row 2: Company and Relationship -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Công ty</mat-label>
              <mat-icon matPrefix>business</mat-icon>
              <input
                matInput
                formControlName="company"
                placeholder="Ví dụ: Công ty ABC"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Mối quan hệ</mat-label>
              <mat-icon matPrefix>groups</mat-icon>
              <input
                matInput
                formControlName="relationship"
                placeholder="Ví dụ: Quản lý trực tiếp, Đồng nghiệp"
              />
            </mat-form-field>
          </div>

          <!-- Row 3: Email and Phone -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Email</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input
                matInput
                formControlName="email"
                placeholder="Ví dụ: reference@company.com"
                type="email"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Số điện thoại</mat-label>
              <mat-icon matPrefix>call</mat-icon>
              <input
                matInput
                formControlName="phone"
                placeholder="Ví dụ: +84 123 456 789"
                type="tel"
              />
            </mat-form-field>
          </div>
        </form>

        <div class="form-actions">
          <button
            mat-raised-button
            color="primary"
            (click)="saveForm()"
            class="save-button"
          >
            <mat-icon>save</mat-icon>
            Lưu
          </button>
        </div>
      </div>
    </mat-expansion-panel>
  `,
  styles: [
    `
      mat-form-field mat-icon[matprefix] {
        color: var(--mat-sys-primary);
        opacity: 0.95;
      }
      .reference-expansion-panel {
        margin-bottom: 16px !important;
        border-radius: 12px !important;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
        overflow: hidden !important;
        background-color: #ffffff !important;

        mat-panel-description {
          display: flex;
          justify-content: flex-end;
        }

        &.mat-expanded {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
        }

        .mat-expansion-panel-header {
          padding: 16px 24px !important;
          height: auto !important;
          min-height: 64px !important;

          &:hover {
            background-color: rgba(0, 0, 0, 0.04) !important;
          }

          .mat-content {
            align-items: center !important;
          }
        }

        .panel-title-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          overflow: hidden;
          white-space: nowrap;

          .reference-name {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            line-height: 1.3;
          }

          .reference-title {
            font-size: 14px;
            color: #666;
            font-weight: 400;
          }
        }

        .delete-btn {
          color: #f44336;
          opacity: 0.7;
          transition: opacity 0.2s ease;

          &:hover {
            opacity: 1;
            background-color: #ffebee;
          }
        }
      }

      .edit-form-container {
        padding: 24px;
        background-color: #fafafa;

        .reference-form {
          display: flex;
          flex-direction: column;
          gap: 16px;

          .form-row {
            display: flex;
            gap: 16px;
            align-items: flex-start;

            .form-field {
              flex: 1;
            }

            @media (max-width: 768px) {
              flex-direction: column;
              gap: 8px;
            }
          }

          .full-width {
            width: 100%;
            margin-bottom: 16px;
          }
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          margin-top: 24px;

          .save-button {
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 200px;
            padding: 12px 24px;
            font-weight: 500;

            mat-icon {
              font-size: 18px;
            }
          }
        }
      }

      // Form field styling
      mat-form-field {
        .mat-mdc-form-field-subscript-wrapper {
          margin-top: 4px;
        }
      }
    `,
  ],
})
export class ReferenceFormEditComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() referenceData: Reference | null = null;
  @Input() isReadOnly: boolean = false;
  @Input() forceCollapse: boolean = false;
  @Output() formChange = new EventEmitter<Reference>();
  @Output() deleteForm = new EventEmitter<void>();
  @Output() editToggle = new EventEmitter<boolean>();
  @Output() requestEdit = new EventEmitter<string>();

  isEditing = false;
  private formSubscription = new Subscription();

  // Form Controls cho Reference
  nameFormControl = new FormControl('');
  titleFormControl = new FormControl('');
  companyFormControl = new FormControl('');
  emailFormControl = new FormControl('');
  phoneFormControl = new FormControl('');
  relationshipFormControl = new FormControl('');
  idFormControl = new FormControl('');

  formGroup = new FormGroup({
    name: this.nameFormControl,
    title: this.titleFormControl,
    company: this.companyFormControl,
    email: this.emailFormControl,
    phone: this.phoneFormControl,
    relationship: this.relationshipFormControl,
    id: this.idFormControl,
  });

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Populate form với dữ liệu hiện có nếu có
    if (this.referenceData) {
      this.formGroup.patchValue({
        name: this.referenceData.name || '',
        title: this.referenceData.title || '',
        company: this.referenceData.company || '',
        email: this.referenceData.email || '',
        phone: this.referenceData.phone || '',
        relationship: this.referenceData.relationship || '',
        id: this.referenceData.id || '',
      });
    }

    const isNewForm =
      !this.referenceData ||
      (!this.referenceData.name && !this.referenceData.title);

    if (isNewForm) {
      this.isEditing = true;
      this.formGroup.enable();
    } else {
      this.isEditing = false;
      this.formGroup.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['forceCollapse'] &&
      changes['forceCollapse'].currentValue &&
      this.isEditing
    ) {
      this.isEditing = false;
      this.formGroup.disable();
    }

    if (changes['referenceData'] && this.referenceData) {
      this.formGroup.patchValue({
        name: this.referenceData.name || '',
        title: this.referenceData.title || '',
        company: this.referenceData.company || '',
        email: this.referenceData.email || '',
        phone: this.referenceData.phone || '',
        relationship: this.referenceData.relationship || '',
        id: this.referenceData.id || '',
      });
    }
  }

  onExpansionChange(): void {
    if (this.isEditing && !this.isReadOnly) {
      // Panel is expanded - enable form and notify parent
      this.formGroup.enable();
      this.requestEdit.emit();
    } else {
      // Panel is collapsed - disable form
      this.formGroup.disable();
    }

    this.editToggle.emit(this.isEditing);
  }

  saveForm(): void {
    // Allow save regardless of form validity
    const referenceInfo: Reference = {
      ...this.formGroup.value,
    } as Reference;

    this.formChange.emit(referenceInfo);
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(CvDeleteConfirmDialogComponent, {
      disableClose: false,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteForm.emit();
      }
    });
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }
}

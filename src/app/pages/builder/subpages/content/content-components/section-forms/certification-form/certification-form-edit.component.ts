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
import { Certification } from '../../../../../../../models/cv-block.model';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import {
  NgxEditorComponent,
  NgxEditorMenuComponent,
  Editor,
  Toolbar,
} from 'ngx-editor';
import { MatDialog } from '@angular/material/dialog';
import { CvDeleteConfirmDialogComponent } from '../../../../../../../components/cv-delete-confirm-dialog/cv-delete-confirm-dialog.component';

@Component({
  selector: 'app-certification-form-edit',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    NgxEditorComponent,
    NgxEditorMenuComponent,
  ],
  template: `
    <mat-expansion-panel
      class="certification-expansion-panel"
      [(expanded)]="isEditing"
      (expandedChange)="onExpansionChange()"
    >
      <mat-expansion-panel-header class="section-header">
        <mat-panel-title>
          <div class="panel-title-content">
            <span class="certification-title">{{
              certificationData?.title || 'Chứng chỉ'
            }}</span>
            <span class="issuer-name" *ngIf="certificationData?.issuer">{{
              certificationData!.issuer
            }}</span>
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
        <form [formGroup]="formGroup" class="certification-form">
          <!-- Row 1: Title and Issuer -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Tên chứng chỉ</mat-label>
              <input
                matInput
                formControlName="title"
                placeholder="Ví dụ: AWS Certified Solutions Architect"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Tổ chức cấp</mat-label>
              <input
                matInput
                formControlName="issuer"
                placeholder="Ví dụ: Amazon Web Services"
              />
            </mat-form-field>
          </div>

          <!-- Row 2: Date Received and Expiry Date -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Ngày cấp</mat-label>
              <input matInput formControlName="dateReceived" type="date" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Ngày hết hạn</mat-label>
              <input matInput formControlName="expiryDate" type="date" />
              <mat-hint>Để trống nếu không có ngày hết hạn</mat-hint>
            </mat-form-field>
          </div>

          <!-- Row 3: Verification URL -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field full-width">
              <mat-label>URL xác minh</mat-label>
              <input
                matInput
                formControlName="verificationUrl"
                placeholder="Ví dụ: https://www.credly.com/badges/..."
                type="url"
              />
              <mat-hint>Link để xác minh chứng chỉ (tùy chọn)</mat-hint>
            </mat-form-field>
          </div>

          <!-- Description with Rich Text Editor -->
          <div class="full-width editor-container">
            <div class="ngx-editor-wrapper">
              <ngx-editor-menu
                [editor]="editor"
                [toolbar]="toolbar"
              ></ngx-editor-menu>
              <ngx-editor
                style="height: fit-content;"
                [editor]="editor"
                [placeholder]="'Mô tả chi tiết về chứng chỉ...'"
                [formControlName]="'description'"
              ></ngx-editor>
            </div>
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
      .certification-expansion-panel {
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

          .certification-title {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            line-height: 1.3;
          }

          .issuer-name {
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

        .certification-form {
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

      .editor-container {
        .ngx-editor-wrapper {
          border: 1px solid #d1d5db; /* viền xám nhạt */
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;

          ngx-editor-menu {
            background: #f9fafb; /* nền toolbar */
            border-bottom: 1px solid #e5e7eb;

            button {
              border-radius: 6px;
              transition: background 0.2s ease;
              &:hover {
                background: #e5e7eb;
              }
              &.active {
                background: #3b82f6;
                color: #fff;
              }
            }
          }

          ngx-editor {
            min-height: 150px;
            max-height: 300px;
            height: 300px !important;
            font-size: 1rem;
            line-height: 1.6;
            font-family: 'Roboto', 'Segoe UI', sans-serif;

            p {
              margin: 0 0 0.75rem;
            }

            ul,
            ol {
              margin: 0.5rem 0 0.5rem 1.25rem;
            }
          }
        }
      }
    `,
  ],
})
export class CertificationFormEditComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() certificationData: Certification | null = null;
  @Input() isReadOnly: boolean = false;
  @Input() forceCollapse: boolean = false;
  @Output() formChange = new EventEmitter<Certification>();
  @Output() deleteForm = new EventEmitter<void>();
  @Output() editToggle = new EventEmitter<boolean>();
  @Output() requestEdit = new EventEmitter<string>();

  // Rich Text Editor
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h4', 'h5'] }],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  isEditing = false;
  private formSubscription = new Subscription();

  // Form Controls cho Certification
  titleFormControl = new FormControl('');
  issuerFormControl = new FormControl('');
  dateReceivedFormControl = new FormControl('');
  expiryDateFormControl = new FormControl('');
  descriptionFormControl = new FormControl('');
  verificationUrlFormControl = new FormControl('');
  idFormControl = new FormControl('');

  formGroup = new FormGroup({
    title: this.titleFormControl,
    issuer: this.issuerFormControl,
    dateReceived: this.dateReceivedFormControl,
    expiryDate: this.expiryDateFormControl,
    description: this.descriptionFormControl,
    verificationUrl: this.verificationUrlFormControl,
    id: this.idFormControl,
  });

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Initialize the editor
    this.editor = new Editor();

    // Populate form với dữ liệu hiện có nếu có
    if (this.certificationData) {
      this.formGroup.patchValue({
        title: this.certificationData.title || '',
        issuer: this.certificationData.issuer || '',
        dateReceived: this.certificationData.dateReceived || '',
        expiryDate: this.certificationData.expiryDate || '',
        description: this.certificationData.description || '',
        verificationUrl: this.certificationData.verificationUrl || '',
        id: this.certificationData.id || '',
      });
    }

    const isNewForm =
      !this.certificationData ||
      (!this.certificationData.title && !this.certificationData.issuer);

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

    if (changes['certificationData'] && this.certificationData) {
      this.formGroup.patchValue({
        title: this.certificationData.title || '',
        issuer: this.certificationData.issuer || '',
        dateReceived: this.certificationData.dateReceived || '',
        expiryDate: this.certificationData.expiryDate || '',
        description: this.certificationData.description || '',
        verificationUrl: this.certificationData.verificationUrl || '',
        id: this.certificationData.id || '',
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
    const certificationInfo: Certification = {
      ...this.formGroup.value,
    } as Certification;

    this.formChange.emit(certificationInfo);
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
    // this.editor.destroy();
  }
}

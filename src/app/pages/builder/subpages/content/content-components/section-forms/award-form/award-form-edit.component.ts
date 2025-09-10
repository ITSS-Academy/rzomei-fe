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
import { Award } from '../../../../../../../models/cv-block.model';
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
  selector: 'app-award-form-edit',
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
      class="experience-expansion-panel"
      [(expanded)]="isEditing"
      (expandedChange)="onExpansionChange()"
    >
      <mat-expansion-panel-header class="section-header">
        <mat-panel-title>
          <div class="panel-title-content">
            <span class="award-title">{{
              awardData?.title || 'Giải thưởng/Chứng nhận'
            }}</span>
            <span class="award-issuer" *ngIf="awardData && awardData.issuer">{{
              awardData.issuer
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
        <form [formGroup]="formGroup" class="experience-form">
          <!-- Row 1: Title and Issuer -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Tên giải thưởng/chứng nhận</mat-label>
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
              <mat-label>Ngày nhận</mat-label>
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
                placeholder="https://verify.example.com/certificate/123"
                type="url"
              />
              <mat-hint
                >Link để xác minh tính hợp lệ của giải thưởng/chứng
                nhận</mat-hint
              >
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
                [placeholder]="
                  'Mô tả chi tiết về giải thưởng, ý nghĩa, thành tựu...'
                "
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
      .experience-expansion-panel {
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

          .award-title {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            line-height: 1.3;
          }

          .award-issuer {
            font-size: 14px;
            color: #666;
            font-weight: 500;
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

      // Empty state styling for new award
      .experience-expansion-panel:has(
          .award-title:contains('Giải thưởng/Chứng nhận')
        ) {
        border: 2px dashed #e0e0e0 !important;
        background-color: #fafafa !important;

        .award-title {
          color: #888;
          font-style: italic;
        }

        &:hover {
          border-color: #ff9800 !important;
          background-color: #fff8e1 !important;
        }
      }

      // Edit Form Styles
      .edit-form-container {
        padding: 24px 0 !important;
        background: transparent;

        .experience-form {
          .form-row {
            display: flex;
            gap: 16px;
            margin-bottom: 16px;

            .form-field {
              flex: 1;

              &.full-width {
                flex: 1 1 100%;
              }
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

        &.mat-focused .mdc-notched-outline__leading,
        &.mat-focused .mdc-notched-outline__notch,
        &.mat-focused .mdc-notched-outline__trailing {
          border-color: #ff9800 !important;
        }
      }

      .editor-container {
        .ngx-editor-wrapper {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;

          &:focus-within {
            border-color: #ff9800;
            box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.1);
          }

          ngx-editor-menu {
            background: #f9fafb;
            border-bottom: 1px solid #e5e7eb;

            button {
              border-radius: 6px;
              transition: background 0.2s ease;
              &:hover {
                background: #e5e7eb;
              }
              &.active {
                background: #ff9800;
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
export class AwardFormEditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() awardData: Award | null = null;
  @Input() isReadOnly: boolean = false;
  @Input() forceCollapse: boolean = false;
  @Output() formChange = new EventEmitter<Award>();
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

  // Form Controls cho Award
  titleFormControl = new FormControl('');
  issuerFormControl = new FormControl('');
  dateReceivedFormControl = new FormControl('');
  expiryDateFormControl = new FormControl('');
  descriptionFormControl = new FormControl('');
  verificationUrlFormControl = new FormControl('');

  formGroup = new FormGroup({
    title: this.titleFormControl,
    issuer: this.issuerFormControl,
    dateReceived: this.dateReceivedFormControl,
    expiryDate: this.expiryDateFormControl,
    description: this.descriptionFormControl,
    verificationUrl: this.verificationUrlFormControl,
  });

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Initialize the editor
    this.editor = new Editor();

    // Populate form với dữ liệu hiện có nếu có
    if (this.awardData) {
      this.formGroup.patchValue({
        title: this.awardData.title || '',
        issuer: this.awardData.issuer || '',
        dateReceived: this.awardData.dateReceived || '',
        expiryDate: this.awardData.expiryDate || '',
        description: this.awardData.description || '',
        verificationUrl: this.awardData.verificationUrl || '',
      });
    }

    const isNewForm =
      !this.awardData || (!this.awardData.title && !this.awardData.issuer);

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

    if (changes['awardData'] && this.awardData) {
      this.formGroup.patchValue({
        title: this.awardData.title || '',
        issuer: this.awardData.issuer || '',
        dateReceived: this.awardData.dateReceived || '',
        expiryDate: this.awardData.expiryDate || '',
        description: this.awardData.description || '',
        verificationUrl: this.awardData.verificationUrl || '',
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
    const awardInfo: Award = {
      ...this.formGroup.value,
    } as Award;

    this.formChange.emit(awardInfo);
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
    this.editor.destroy();
  }
}

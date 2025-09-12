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
import { Experience } from '../../../../../../../models/cv-block.model';
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
// Bỏ import uuid

@Component({
  selector: 'app-experience-form-edit',
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
            <span class="job-title">{{
              experienceData?.position || 'Kinh nghiệm làm việc'
            }}</span>
            <span class="company-name" *ngIf="experienceData?.company">{{
              experienceData!.company
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
          <!-- Row 1: Position and Company -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Vị trí công việc</mat-label>
              <mat-icon matPrefix>work</mat-icon>
              <input
                matInput
                formControlName="position"
                placeholder="Ví dụ: Frontend Developer"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Công ty</mat-label>
              <mat-icon matPrefix>business</mat-icon>
              <input
                matInput
                formControlName="company"
                placeholder="Ví dụ: Công ty XYZ"
              />
            </mat-form-field>
          </div>

          <!-- Row 2: Location -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field full-width">
              <mat-label>Địa điểm</mat-label>
              <mat-icon matPrefix>place</mat-icon>
              <input
                matInput
                formControlName="location"
                placeholder="Ví dụ: Hà Nội, Việt Nam"
              />
            </mat-form-field>
          </div>

          <!-- Row 3: Start Date and End Date -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Ngày bắt đầu</mat-label>
              <mat-icon matPrefix>event</mat-icon>
              <input matInput formControlName="startDate" type="date" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Ngày kết thúc</mat-label>
              <mat-icon matPrefix>event_available</mat-icon>
              <input matInput formControlName="endDate" type="date" />
              <mat-hint>Để trống nếu vẫn đang làm việc</mat-hint>
            </mat-form-field>
          </div>

          <!-- Current job checkbox -->
          <div class="form-row checkbox-row">
            <mat-checkbox formControlName="current">
              Tôi hiện đang làm việc ở đây
            </mat-checkbox>
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
                [placeholder]="'Mô tả chi tiết về trách nhiệm và thành tựu...'"
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
      mat-form-field mat-icon[matprefix] {
        color: var(--mat-sys-primary);
        opacity: 0.95;
      }

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

          .job-title {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            line-height: 1.3;
          }

          .company-name {
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

      // Empty state styling for new experience
      .experience-expansion-panel:has(
          .job-title:contains('Kinh nghiệm làm việc')
        ) {
        border: 2px dashed #e0e0e0 !important;
        background-color: #fafafa !important;

        .job-title {
          color: #888;
          font-style: italic;
        }

        &:hover {
          border-color: #2196f3 !important;
          background-color: #f0f8ff !important;
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

            &.checkbox-row {
              margin-bottom: 20px;
              padding-left: 10px;
            }

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
export class ExperienceFormEditComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() experienceData: Experience | null = null;
  @Input() isReadOnly: boolean = false;
  @Input() forceCollapse: boolean = false; // Thêm input để force đóng form
  @Output() formChange = new EventEmitter<Experience>();
  @Output() deleteForm = new EventEmitter<void>();
  @Output() editToggle = new EventEmitter<boolean>();
  @Output() requestEdit = new EventEmitter<string>(); // Emit khi muốn mở form này

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

  // Form Controls cho Experience - Giữ validation nhưng không block save
  companyFormControl = new FormControl('');
  positionFormControl = new FormControl('');
  locationFormControl = new FormControl('');
  startDateFormControl = new FormControl('');
  endDateFormControl = new FormControl('');
  currentFormControl = new FormControl(false);
  descriptionFormControl = new FormControl('');
  idFormControl = new FormControl('');

  formGroup = new FormGroup({
    company: this.companyFormControl,
    position: this.positionFormControl,
    location: this.locationFormControl,
    startDate: this.startDateFormControl,
    endDate: this.endDateFormControl,
    current: this.currentFormControl,
    description: this.descriptionFormControl,
    id: this.idFormControl,
  });

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Initialize the editor
    this.editor = new Editor();

    // Populate form với dữ liệu hiện có nếu có
    if (this.experienceData) {
      this.formGroup.patchValue({
        company: this.experienceData.company || '',
        position: this.experienceData.position || '',
        location: this.experienceData.location || '',
        startDate: this.experienceData.startDate || '',
        endDate: this.experienceData.endDate || '',
        current: this.experienceData.current || false,
        description: this.experienceData.description || '',
        // Giữ nguyên ID từ dữ liệu hiện có nếu có
        id: this.experienceData.id || '',
      });
    }
    // Không tạo ID mới nữa

    const isNewForm =
      !this.experienceData ||
      (!this.experienceData.position && !this.experienceData.company);

    if (isNewForm) {
      this.isEditing = true;
      this.formGroup.enable();
    } else {
      this.isEditing = false;
      this.formGroup.disable();
    }

    // Disable endDate when current is checked
    this.formSubscription.add(
      this.currentFormControl.valueChanges.subscribe((isCurrent) => {
        if (isCurrent) {
          this.endDateFormControl.disable();
          this.endDateFormControl.setValue('');
        } else {
          this.endDateFormControl.enable();
        }
      })
    );
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

    if (changes['experienceData'] && this.experienceData) {
      this.formGroup.patchValue({
        company: this.experienceData.company || '',
        position: this.experienceData.position || '',
        location: this.experienceData.location || '',
        startDate: this.experienceData.startDate || '',
        endDate: this.experienceData.endDate || '',
        current: this.experienceData.current || false,
        description: this.experienceData.description || '',
        // Giữ nguyên ID từ dữ liệu hiện có nếu có, không tạo mới
        id: this.experienceData.id || '',
      });

      // Handle current checkbox logic
      if (this.experienceData.current) {
        this.endDateFormControl.disable();
      } else {
        this.endDateFormControl.enable();
      }
    }
  }

  onExpansionChange(): void {
    if (this.isEditing && !this.isReadOnly) {
      // Panel is expanded - enable form and notify parent
      this.formGroup.enable();

      // Still keep endDate disabled if current is checked
      if (this.currentFormControl.value) {
        this.endDateFormControl.disable();
      }

      this.requestEdit.emit();
    } else {
      // Panel is collapsed - disable form
      this.formGroup.disable();
    }

    this.editToggle.emit(this.isEditing);
  }

  saveForm(): void {
    // Allow save regardless of form validity
    const experienceInfo: Experience = {
      ...this.formGroup.value,
    } as Experience;

    // Ensure endDate is empty when current is true
    if (experienceInfo.current) {
      experienceInfo.endDate = '';
    }

    this.formChange.emit(experienceInfo);
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

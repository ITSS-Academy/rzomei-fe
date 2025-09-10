import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  EventEmitter,
  Output,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../../../../../../shared/material/material.module';
import { Course } from '../../../../../../../models/cv-block.model';
import { Editor, Toolbar } from 'ngx-editor';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CvDeleteConfirmDialogComponent } from '../../../../../../../components/cv-delete-confirm-dialog/cv-delete-confirm-dialog.component';
import { NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor';

@Component({
  selector: 'app-course-form-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
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
            <span class="course-title">{{
              courseData?.title || 'Khóa học'
            }}</span>
            <span class="course-provider" *ngIf="courseData?.provider">
              {{ courseData?.provider }}
            </span>
          </div>
        </mat-panel-title>
        <mat-panel-description>
          <button
            mat-icon-button
            color="warn"
            class="delete-btn"
            matTooltip="Xóa"
            (click)="onDelete(); $event.stopPropagation()"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </mat-panel-description>
      </mat-expansion-panel-header>

      <!-- Edit Form Content -->
      <div class="edit-form-container">
        <form [formGroup]="formGroup" class="experience-form">
          <!-- Row 1: Title and Provider -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Tên khóa học</mat-label>
              <input
                matInput
                formControlName="title"
                placeholder="Ví dụ: Angular Development"
              />
              <mat-error *ngIf="formGroup.get('title')?.hasError('required')">
                Vui lòng nhập tên khóa học
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Nhà cung cấp</mat-label>
              <input
                matInput
                formControlName="provider"
                placeholder="Ví dụ: Coursera, Udemy"
              />
              <mat-error
                *ngIf="formGroup.get('provider')?.hasError('required')"
              >
                Vui lòng nhập nhà cung cấp
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Row 2: Duration and Completion Date -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Thời lượng</mat-label>
              <input
                matInput
                formControlName="duration"
                placeholder="Ví dụ: 40 giờ, 3 tháng"
              />
              <mat-error
                *ngIf="formGroup.get('duration')?.hasError('required')"
              >
                Vui lòng nhập thời lượng khóa học
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Ngày hoàn thành</mat-label>
              <input
                matInput
                [matDatepicker]="completionPicker"
                formControlName="completionDate"
                placeholder="dd/mm/yyyy"
              />
              <mat-hint>DD/MM/YYYY</mat-hint>
              <mat-datepicker-toggle
                matIconSuffix
                [for]="completionPicker"
              ></mat-datepicker-toggle>
              <mat-datepicker #completionPicker></mat-datepicker>
              <mat-error
                *ngIf="formGroup.get('completionDate')?.hasError('required')"
              >
                Vui lòng chọn ngày hoàn thành
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Row 3: Certificate URL -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field full-width">
              <mat-label>Link chứng chỉ (tùy chọn)</mat-label>
              <input
                matInput
                formControlName="certificateUrl"
                placeholder="https://..."
                type="url"
              />
              <mat-hint>URL đến chứng chỉ hoàn thành khóa học</mat-hint>
            </mat-form-field>
          </div>

          <!-- Description with Rich Text Editor -->
          <div class="full-width editor-container">
            <mat-label class="editor-label"
              >Mô tả khóa học (tùy chọn)</mat-label
            >
            <div class="ngx-editor-wrapper">
              <ngx-editor-menu
                [editor]="editor"
                [toolbar]="toolbar"
              ></ngx-editor-menu>
              <ngx-editor
                [editor]="editor"
                [placeholder]="
                  'Thêm mô tả chi tiết về khóa học, kỹ năng học được...'
                "
                formControlName="description"
              ></ngx-editor>
            </div>
          </div>
        </form>

        <div class="form-actions">
          <button
            mat-raised-button
            color="primary"
            class="save-button"
            (click)="saveForm()"
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
        margin-bottom: 20px !important; // Increased margin for course forms
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
          padding: 20px 28px !important; // Increased padding for course forms
          height: auto !important;
          min-height: 68px !important; // Slightly increased height

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

          .course-title {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            line-height: 1.3;
          }

          .course-provider {
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

      // Empty state styling for new course
      .experience-expansion-panel:has(.course-title:contains('Khóa học')) {
        border: 2px dashed #e0e0e0 !important;
        background-color: #fafafa !important;

        .course-title {
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
        padding: 28px 0 !important; // Increased padding for course forms
        background: transparent;

        .experience-form {
          .form-row {
            display: flex;
            gap: 20px; // Increased gap for course forms
            margin-bottom: 20px; // Increased margin for course forms

            .form-field {
              flex: 1;

              &.full-width {
                width: 100%;
              }
            }

            @media (max-width: 768px) {
              flex-direction: column;
              gap: 8px;
            }
          }

          .full-width {
            width: 100%;
            margin-bottom: 20px; // Increased margin for course forms
          }
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          padding-top: 24px; // Increased padding for course forms
          border-top: 1px solid #e0e0e0;
          margin-top: 28px; // Increased margin for course forms

          .save-button {
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 200px;
            padding: 14px 28px; // Increased padding for course forms
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
          margin-top: 6px; // Increased margin for course forms
        }
      }

      .editor-container {
        margin-top: 12px; // Increased margin for course forms

        .editor-label {
          display: block;
          font-size: 14px;
          color: #666;
          margin-bottom: 12px; // Increased margin for course forms
          font-weight: 500;
        }

        .ngx-editor-wrapper {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          background: white;

          ::ng-deep {
            .NgxEditor {
              border: none;

              .NgxEditor__Content {
                min-height: 140px; // Increased height for course forms
                padding: 20px; // Increased padding for course forms
                font-size: 14px;
                line-height: 1.5;

                p {
                  margin: 0 0 10px 0; // Increased margin for course forms

                  &:last-child {
                    margin-bottom: 0;
                  }
                }
              }

              .NgxEditor__Placeholder {
                color: #999;
                font-style: italic;
              }
            }

            .NgxEditor__MenuBar {
              border-bottom: 1px solid #eee;
              padding: 10px 16px; // Increased padding for course forms
              background-color: #f8f9fa;

              .NgxEditor__MenuItem {
                margin: 0 3px; // Increased margin for course forms
                border-radius: 4px;

                &:hover {
                  background-color: #e9ecef;
                }

                &.NgxEditor__MenuItem--Active {
                  background-color: #007bff;
                  color: white;
                }
              }
            }
          }
        }
      }

      @media (max-width: 768px) {
        .edit-form-container {
          padding: 20px 0 !important; // Responsive padding for mobile

          .experience-form {
            .form-row {
              gap: 12px;
              margin-bottom: 16px;
            }

            .full-width {
              margin-bottom: 16px;
            }
          }

          .form-actions {
            padding-top: 20px;
            margin-top: 24px;

            .save-button {
              width: 100%;
              padding: 12px 20px;
            }
          }
        }

        .editor-container {
          margin-top: 8px;

          .editor-label {
            margin-bottom: 8px;
          }

          .ngx-editor-wrapper {
            ::ng-deep {
              .NgxEditor {
                .NgxEditor__Content {
                  min-height: 120px;
                  padding: 16px;
                }
              }

              .NgxEditor__MenuBar {
                padding: 8px 12px;

                .NgxEditor__MenuItem {
                  margin: 0 2px;
                }
              }
            }
          }
        }
      }
    `,
  ],
})
export class CourseFormEditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() courseData: Course | null = null;
  @Input() isReadOnly: boolean = false;
  @Input() forceCollapse: boolean = false;
  @Output() formChange = new EventEmitter<Course>();
  @Output() deleteForm = new EventEmitter<void>();
  @Output() requestEdit = new EventEmitter<void>();
  @Output() editToggle = new EventEmitter<boolean>();

  formGroup!: FormGroup;
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  private subscriptions = new Subscription();
  isEditing = false;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.editor = new Editor();
    this.initializeForm();
    // Không tự động subscribe vào form changes
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courseData'] && this.formGroup) {
      this.updateFormData();
    }
    if (changes['forceCollapse'] && this.forceCollapse) {
      this.isEditing = false;
      this.formGroup.disable();
    }
  }

  private initializeForm(): void {
    this.formGroup = new FormGroup({
      title: new FormControl(this.courseData?.title || '', [
        Validators.required,
      ]),
      provider: new FormControl(this.courseData?.provider || '', [
        Validators.required,
      ]),
      duration: new FormControl(this.courseData?.duration || ''),
      completionDate: new FormControl(this.courseData?.completionDate || '', [
        Validators.required,
      ]),
      certificateUrl: new FormControl(this.courseData?.certificateUrl || ''),
      description: new FormControl(this.courseData?.description || ''),
      id: new FormControl(this.courseData?.id || this.generateId()),
    });

    // Kiểm tra nếu là form mới thì tự động mở để edit
    const isNewForm =
      !this.courseData || (!this.courseData.title && !this.courseData.provider);
    if (isNewForm) {
      this.isEditing = true;
      this.formGroup.enable();
    } else {
      this.isEditing = false;
      this.formGroup.disable();
    }
  }

  private updateFormData(): void {
    if (this.courseData) {
      this.formGroup.patchValue({
        title: this.courseData.title || '',
        provider: this.courseData.provider || '',
        duration: this.courseData.duration || '',
        completionDate: this.courseData.completionDate || '',
        certificateUrl: this.courseData.certificateUrl || '',
        description: this.courseData.description || '',
        id: this.courseData.id || this.generateId(),
      });
    }
  }

  // Xóa setupFormSubscription method vì không cần tự động update

  private generateId(): string {
    return (
      'course_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
  }

  onExpansionChange(): void {
    if (this.isEditing) {
      this.formGroup.enable();
      this.requestEdit.emit();
    } else {
      this.formGroup.disable();
    }
    this.editToggle.emit(this.isEditing);
  }

  saveForm(): void {
    this.formChange.emit(this.formGroup.value as Course);
    this.isEditing = false;
    this.formGroup.disable();
    this.editToggle.emit(false);
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(CvDeleteConfirmDialogComponent, {
      data: {
        title: 'Xác nhận xóa',
        message: 'Bạn có chắc chắn muốn xóa khóa học này?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteForm.emit();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.editor) {
      this.editor.destroy();
    }
  }
}

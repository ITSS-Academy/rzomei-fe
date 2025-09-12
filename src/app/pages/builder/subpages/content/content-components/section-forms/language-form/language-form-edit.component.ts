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
import { Language } from '../../../../../../../models/cv-block.model';
import { Editor, Toolbar } from 'ngx-editor';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CvDeleteConfirmDialogComponent } from '../../../../../../../components/cv-delete-confirm-dialog/cv-delete-confirm-dialog.component';
import { NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor';

@Component({
  selector: 'app-language-form-edit',
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
            <span class="language-name">{{
              languageData?.language || 'Ngôn ngữ'
            }}</span>
            <span class="language-level" *ngIf="languageData?.level">{{
              languageData?.level
            }}</span>
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
          <!-- Row 1: Language and Level -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Ngôn ngữ</mat-label>
              <mat-icon matPrefix>language</mat-icon>
              <input
                matInput
                formControlName="language"
                placeholder="Ví dụ: Tiếng Anh"
              />
              <mat-error
                *ngIf="formGroup.get('language')?.hasError('required')"
              >
                Vui lòng nhập tên ngôn ngữ
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Trình độ</mat-label>
              <mat-icon matPrefix>bar_chart</mat-icon>
              <mat-select formControlName="level">
                <mat-option value="Sơ cấp">Sơ cấp</mat-option>
                <mat-option value="Trung cấp">Trung cấp</mat-option>
                <mat-option value="Cao cấp">Cao cấp</mat-option>
                <mat-option value="Bản ngữ">Bản ngữ</mat-option>
                <mat-option value="A1">A1 (Khởi đầu)</mat-option>
                <mat-option value="A2">A2 (Cơ bản)</mat-option>
                <mat-option value="B1">B1 (Trung cấp thấp)</mat-option>
                <mat-option value="B2">B2 (Trung cấp cao)</mat-option>
                <mat-option value="C1">C1 (Thông thạo)</mat-option>
                <mat-option value="C2">C2 (Gần bản ngữ)</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <!-- Row 2: Certification and Score -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Chứng chỉ (tùy chọn)</mat-label>
              <mat-icon matPrefix>verified</mat-icon>
              <input
                matInput
                formControlName="certification"
                placeholder="Ví dụ: IELTS, TOEFL, TOEIC"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Điểm số (tùy chọn)</mat-label>
              <mat-icon matPrefix>star</mat-icon>
              <input
                matInput
                formControlName="score"
                placeholder="Ví dụ: 7.5, 900"
              />
            </mat-form-field>
          </div>

          <!-- Description with Rich Text Editor -->
          <div class="full-width editor-container">
            <mat-label class="editor-label"
              >Mô tả chi tiết (tùy chọn)</mat-label
            >
            <div class="ngx-editor-wrapper">
              <ngx-editor-menu
                [editor]="editor"
                [toolbar]="toolbar"
              ></ngx-editor-menu>
              <ngx-editor
                [editor]="editor"
                [placeholder]="'Thêm mô tả chi tiết về trình độ ngôn ngữ...'"
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

          .language-name {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            line-height: 1.3;
          }

          .language-level {
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

      .edit-form-container {
        padding: 0 24px 24px 24px;
        background-color: #fafafa;
      }

      .experience-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .form-row {
        display: flex;
        gap: 16px;
        align-items: flex-start;

        @media (max-width: 768px) {
          flex-direction: column;
          gap: 0;
        }
      }

      .form-field {
        flex: 1;
        min-width: 0;

        &.full-width {
          width: 100%;
        }
      }

      .full-width {
        width: 100%;
      }

      .editor-container {
        margin-top: 8px;

        .editor-label {
          display: block;
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
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
                min-height: 120px;
                padding: 16px;
                font-size: 14px;
                line-height: 1.5;

                p {
                  margin: 0 0 8px 0;

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
              padding: 8px 12px;
              background-color: #f8f9fa;

              .NgxEditor__MenuItem {
                margin: 0 2px;
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

      .form-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #eee;

        .save-button {
          min-width: 120px;
          height: 40px;
          border-radius: 8px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      }

      @media (max-width: 768px) {
        .edit-form-container {
          padding: 0 16px 16px 16px;
        }

        .form-actions {
          .save-button {
            width: 100%;
          }
        }
      }
    `,
  ],
})
export class LanguageFormEditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() languageData: Language | null = null;
  @Input() isReadOnly: boolean = false;
  @Input() forceCollapse: boolean = false;
  @Output() formChange = new EventEmitter<Language>();
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
    if (changes['languageData'] && this.formGroup) {
      this.updateFormData();
    }
    if (changes['forceCollapse'] && this.forceCollapse) {
      this.isEditing = false;
      this.formGroup.disable();
    }
  }

  private initializeForm(): void {
    this.formGroup = new FormGroup({
      language: new FormControl(this.languageData?.language || '', [
        Validators.required,
      ]),
      level: new FormControl(this.languageData?.level || ''),
      certification: new FormControl(this.languageData?.certification || ''),
      score: new FormControl(this.languageData?.score || ''),
      description: new FormControl(this.languageData?.description || ''),
      id: new FormControl(this.languageData?.id || this.generateId()),
    });

    // Kiểm tra nếu là form mới thì tự động mở để edit
    const isNewForm =
      !this.languageData ||
      (!this.languageData.language && !this.languageData.level);
    if (isNewForm) {
      this.isEditing = true;
      this.formGroup.enable();
    } else {
      this.isEditing = false;
      this.formGroup.disable();
    }
  }

  private updateFormData(): void {
    if (this.languageData) {
      this.formGroup.patchValue({
        language: this.languageData.language || '',
        level: this.languageData.level || '',
        certification: this.languageData.certification || '',
        score: this.languageData.score || '',
        description: this.languageData.description || '',
        id: this.languageData.id || this.generateId(),
      });
    }
  }

  // Xóa setupFormSubscription method vì không cần tự động update

  private generateId(): string {
    return 'lang_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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
    // Cho phép save bất kể form có valid hay không (giống skill-form)
    const languageInfo: Language = {
      ...this.formGroup.value,
    } as Language;

    this.formChange.emit(languageInfo);
    this.isEditing = false;
    this.editToggle.emit(false);
    this.formGroup.disable();
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(CvDeleteConfirmDialogComponent, {
      data: {
        title: 'Xác nhận xóa',
        message: 'Bạn có chắc chắn muốn xóa ngôn ngữ này?',
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

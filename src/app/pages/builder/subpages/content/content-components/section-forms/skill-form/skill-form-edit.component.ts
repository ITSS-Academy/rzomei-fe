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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../../../shared/material/material.module';
import { Skill } from '../../../../../../../models/cv-block.model';
import { Editor, Toolbar } from 'ngx-editor';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CvDeleteConfirmDialogComponent } from '../../../../../../../components/cv-delete-confirm-dialog/cv-delete-confirm-dialog.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor';

@Component({
  selector: 'app-skill-form-edit',
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
            <span class="skill-category">{{
              skillData?.category || 'Kỹ năng'
            }}</span>
            <span class="skill-level" *ngIf="skillData?.level">{{
              skillData?.level
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
          <!-- Row 1: Category and Level -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Danh mục kỹ năng</mat-label>
              <mat-icon matPrefix>category</mat-icon>
              <input
                matInput
                formControlName="category"
                placeholder="Ví dụ: Ngôn ngữ lập trình"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Trình độ</mat-label>
              <mat-icon matPrefix>bar_chart</mat-icon>
              <mat-select formControlName="level">
                <mat-option value="Cơ bản">Cơ bản</mat-option>
                <mat-option value="Trung bình">Trung bình</mat-option>
                <mat-option value="Khá">Khá</mat-option>
                <mat-option value="Giỏi">Giỏi</mat-option>
                <mat-option value="Chuyên gia">Chuyên gia</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <!-- Row 2: Skills Items -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field full-width">
              <mat-label>Các kỹ năng cụ thể</mat-label>
              <mat-icon matPrefix>star</mat-icon>
              <mat-chip-grid #chipGrid aria-label="Skill selection">
                <mat-chip-row
                  *ngFor="let skill of itemsFormControl.value"
                  (removed)="removeSkill(skill)"
                  [editable]="true"
                  [removable]="true"
                >
                  {{ skill }}
                  <button matChipRemove [attr.aria-label]="'Xóa ' + skill">
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip-row>
                <input
                  placeholder="Thêm kỹ năng..."
                  [matChipInputFor]="chipGrid"
                  [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                  (matChipInputTokenEnd)="addSkill($event)"
                  #chipInput
                />
              </mat-chip-grid>
              <mat-hint>Nhấn Enter hoặc dấu phẩy để thêm kỹ năng</mat-hint>
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
                [placeholder]="'Thêm mô tả chi tiết về kỹ năng...'"
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

          .skill-category {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            line-height: 1.3;
          }

          .skill-level {
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

      // Empty state styling for new skill
      .experience-expansion-panel:has(.skill-category:contains('Kỹ năng')) {
        border: 2px dashed #e0e0e0 !important;
        background-color: #fafafa !important;

        .skill-category {
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
      }

      .editor-container {
        .editor-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
          display: block;
        }

        .ngx-editor-wrapper {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;

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

      mat-form-field mat-icon[matprefix] {
        color: var(--mat-sys-primary);
        opacity: 0.95;
      }
    `,
  ],
})
export class SkillFormEditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() skillData: Skill | null = null;
  // @Input() isReadOnly: boolean = false;
  @Input() forceCollapse: boolean = false; // Thêm input để force đóng form
  @Output() formChange = new EventEmitter<Skill>();
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

  // Chip input settings
  separatorKeysCodes: number[] = [ENTER, COMMA];

  categoryFormControl = new FormControl('');
  levelFormControl = new FormControl('');
  itemsFormControl = new FormControl<string[]>([]);
  descriptionFormControl = new FormControl('');

  formGroup = new FormGroup({
    category: this.categoryFormControl,
    level: this.levelFormControl,
    items: this.itemsFormControl,
    description: this.descriptionFormControl,
  });

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Initialize the editor
    this.editor = new Editor();

    // Populate form với dữ liệu hiện có nếu có
    if (this.skillData) {
      this.formGroup.patchValue({
        category: this.skillData.category || '',
        level: this.skillData.level || '',
        items: this.skillData.items || [],
        description: this.skillData.description || '',
      });
    }
    // Không tạo ID mới nữa
    const isNewForm =
      !this.skillData || (!this.skillData.category && !this.skillData.level);

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

    if (changes['skillData'] && this.skillData) {
      this.formGroup.patchValue({
        category: this.skillData.category || '',
        level: this.skillData.level || '',
        items: this.skillData.items || [],
        description: this.skillData.description || '',
      });
    }
  }

  onExpansionChange(): void {
    if (this.isEditing) {
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
    const skillInfo: Skill = {
      ...this.formGroup.value,
    } as Skill;

    this.formChange.emit(skillInfo);
  }

  // Chip handling methods
  addSkill(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      const currentItems = this.itemsFormControl.value || [];
      // Kiểm tra không trùng lặp và không rỗng
      if (!currentItems.includes(value) && value.length > 0) {
        this.itemsFormControl.setValue([...currentItems, value]);
      }
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeSkill(skill: string): void {
    const currentItems = this.itemsFormControl.value || [];
    const index = currentItems.indexOf(skill);

    if (index >= 0) {
      currentItems.splice(index, 1);
      this.itemsFormControl.setValue([...currentItems]);
    }
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

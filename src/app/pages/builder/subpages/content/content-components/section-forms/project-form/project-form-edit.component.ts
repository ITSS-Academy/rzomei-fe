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
import { Project } from '../../../../../../../models/cv-block.model';
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
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-project-form-edit',
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
            <span class="project-title">{{
              projectData?.title || 'Dự án'
            }}</span>
            <!-- <span class="project-tech" *ngIf="projectData && projectData.technologies && projectData.technologies.length > 0">{{
              projectData.technologies.slice(0, 2).join(', ') + (projectData.technologies.length > 2 ? '...' : '')
            }}</span> -->
            <span class="project-tech">{{ projectData?.url }}</span>
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
          <!-- Row 1: Title and URL -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Tên dự án</mat-label>
              <input
                matInput
                formControlName="title"
                placeholder="Ví dụ: Website E-commerce"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>URL dự án</mat-label>
              <input
                matInput
                formControlName="url"
                placeholder="https://example.com"
                type="url"
              />
            </mat-form-field>
          </div>

          <!-- Row 2: GitHub and Date range -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>GitHub Repository</mat-label>
              <input
                matInput
                formControlName="github"
                placeholder="https://github.com/username/project"
                type="url"
              />
            </mat-form-field>
          </div>

          <!-- Row 3: Start Date and End Date -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Ngày bắt đầu</mat-label>
              <input matInput formControlName="startDate" type="date" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Ngày kết thúc</mat-label>
              <input matInput formControlName="endDate" type="date" />
              <mat-hint>Để trống nếu vẫn đang phát triển</mat-hint>
            </mat-form-field>
          </div>

          <!-- Row 4: Technologies -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field full-width">
              <mat-label>Công nghệ sử dụng</mat-label>
              <mat-chip-grid #chipGrid aria-label="Technology selection">
                <mat-chip-row
                  *ngFor="let tech of technologiesFormControl.value"
                  (removed)="removeTechnology(tech)"
                  [editable]="true"
                  [removable]="true"
                >
                  {{ tech }}
                  <button matChipRemove [attr.aria-label]="'Xóa ' + tech">
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip-row>
                <input
                  placeholder="Thêm công nghệ..."
                  [matChipInputFor]="chipGrid"
                  [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                  (matChipInputTokenEnd)="addTechnology($event)"
                  #chipInput
                />
              </mat-chip-grid>
              <mat-hint>Nhấn Enter hoặc dấu phẩy để thêm công nghệ</mat-hint>
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
                  'Mô tả chi tiết về dự án, tính năng chính, vai trò của bạn...'
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

          .project-title {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            line-height: 1.3;
          }

          .project-tech {
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

      // Empty state styling for new project
      .experience-expansion-panel:has(.project-title:contains('Dự án')) {
        border: 2px dashed #e0e0e0 !important;
        background-color: #fafafa !important;

        .project-title {
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
    `,
  ],
})
export class ProjectFormEditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() projectData: Project | null = null;
  @Input() isReadOnly: boolean = false;
  @Input() forceCollapse: boolean = false;
  @Output() formChange = new EventEmitter<Project>();
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

  // Chip input settings
  separatorKeysCodes: number[] = [ENTER, COMMA];

  // Form Controls cho Project
  titleFormControl = new FormControl('');
  descriptionFormControl = new FormControl('');
  technologiesFormControl = new FormControl<string[]>([]);
  urlFormControl = new FormControl('');
  githubFormControl = new FormControl('');
  startDateFormControl = new FormControl('');
  endDateFormControl = new FormControl('');

  formGroup = new FormGroup({
    title: this.titleFormControl,
    description: this.descriptionFormControl,
    technologies: this.technologiesFormControl,
    url: this.urlFormControl,
    github: this.githubFormControl,
    startDate: this.startDateFormControl,
    endDate: this.endDateFormControl,
  });

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Initialize the editor
    this.editor = new Editor();

    // Populate form với dữ liệu hiện có nếu có
    if (this.projectData) {
      this.formGroup.patchValue({
        title: this.projectData.title || '',
        description: this.projectData.description || '',
        technologies: this.projectData.technologies || [],
        url: this.projectData.url || '',
        github: this.projectData.github || '',
        startDate: this.projectData.startDate || '',
        endDate: this.projectData.endDate || '',
      });
    }

    const isNewForm =
      !this.projectData ||
      (!this.projectData.title && !this.projectData.description);

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

    if (changes['projectData'] && this.projectData) {
      this.formGroup.patchValue({
        title: this.projectData.title || '',
        description: this.projectData.description || '',
        technologies: this.projectData.technologies || [],
        url: this.projectData.url || '',
        github: this.projectData.github || '',
        startDate: this.projectData.startDate || '',
        endDate: this.projectData.endDate || '',
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
    const projectInfo: Project = {
      ...this.formGroup.value,
    } as Project;

    this.formChange.emit(projectInfo);
  }

  // Technology chip handling methods
  addTechnology(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      const currentTechnologies = this.technologiesFormControl.value || [];
      // Kiểm tra không trùng lặp và không rỗng
      if (!currentTechnologies.includes(value) && value.length > 0) {
        this.technologiesFormControl.setValue([...currentTechnologies, value]);
      }
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeTechnology(technology: string): void {
    const currentTechnologies = this.technologiesFormControl.value || [];
    const index = currentTechnologies.indexOf(technology);

    if (index >= 0) {
      currentTechnologies.splice(index, 1);
      this.technologiesFormControl.setValue([...currentTechnologies]);
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

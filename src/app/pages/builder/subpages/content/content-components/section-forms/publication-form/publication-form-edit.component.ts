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
  FormArray,
} from '@angular/forms';
import { MaterialModule } from '../../../../../../../shared/material/material.module';
import { Publication } from '../../../../../../../models/cv-block.model';
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
  selector: 'app-publication-form-edit',
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
      class="publication-expansion-panel"
      [(expanded)]="isEditing"
      (expandedChange)="onExpansionChange()"
    >
      <mat-expansion-panel-header class="section-header">
        <mat-panel-title>
          <div class="panel-title-content">
            <span class="publication-title">{{
              publicationData?.title || 'Xuất bản'
            }}</span>
            <span class="venue-name" *ngIf="publicationData?.venue">{{
              publicationData!.venue
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
        <form [formGroup]="formGroup" class="publication-form">
          <!-- Row 1: Title -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field full-width">
              <mat-label>Tiêu đề xuất bản</mat-label>
              <input
                matInput
                formControlName="title"
                placeholder="Ví dụ: A Novel Approach to Machine Learning"
              />
            </mat-form-field>
          </div>

          <!-- Row 2: Authors -->
          <div class="form-row">
            <div class="authors-section full-width">
              <label class="authors-label">Tác giả</label>
              <div class="authors-container">
                <div
                  *ngFor="let author of authorsArray.controls; let i = index"
                  class="author-input-row"
                >
                  <mat-form-field appearance="outline" class="author-field">
                    <mat-label>Tác giả {{ i + 1 }}</mat-label>
                    <input
                      matInput
                      [formControl]="$any(author)"
                      placeholder="Ví dụ: Nguyễn Văn A"
                    />
                  </mat-form-field>
                  <button
                    mat-icon-button
                    color="warn"
                    type="button"
                    (click)="removeAuthor(i)"
                    *ngIf="authorsArray.length > 1"
                    matTooltip="Xóa tác giả"
                  >
                    <mat-icon>remove</mat-icon>
                  </button>
                </div>
                <button
                  mat-stroked-button
                  type="button"
                  (click)="addAuthor()"
                  class="add-author-btn"
                >
                  <mat-icon>add</mat-icon>
                  Thêm tác giả
                </button>
              </div>
            </div>
          </div>

          <!-- Row 3: Venue and Date -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Nơi xuất bản</mat-label>
              <input
                matInput
                formControlName="venue"
                placeholder="Ví dụ: IEEE Transactions on AI"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Ngày xuất bản</mat-label>
              <input matInput formControlName="date" type="date" />
            </mat-form-field>
          </div>

          <!-- Row 4: DOI and URL -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>DOI</mat-label>
              <input
                matInput
                formControlName="doi"
                placeholder="Ví dụ: 10.1109/example.2023.123456"
              />
              <mat-hint>Digital Object Identifier (tùy chọn)</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>URL</mat-label>
              <input
                matInput
                formControlName="url"
                placeholder="Ví dụ: https://ieeexplore.ieee.org/..."
                type="url"
              />
              <mat-hint>Link đến bài báo (tùy chọn)</mat-hint>
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
                [placeholder]="'Mô tả chi tiết về xuất bản...'"
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
      .publication-expansion-panel {
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

          .publication-title {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            line-height: 1.3;
          }

          .venue-name {
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

        .publication-form {
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

          .authors-section {
            .authors-label {
              display: block;
              font-size: 14px;
              font-weight: 500;
              color: #333;
              margin-bottom: 8px;
            }

            .authors-container {
              .author-input-row {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;

                .author-field {
                  flex: 1;
                  margin-bottom: 0;
                }
              }

              .add-author-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-top: 8px;
              }
            }
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
export class PublicationFormEditComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() publicationData: Publication | null = null;
  @Input() isReadOnly: boolean = false;
  @Input() forceCollapse: boolean = false;
  @Output() formChange = new EventEmitter<Publication>();
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

  // Form Controls cho Publication
  titleFormControl = new FormControl('');
  authorsFormArray = new FormArray([new FormControl('')]);
  venueFormControl = new FormControl('');
  dateFormControl = new FormControl('');
  doiFormControl = new FormControl('');
  urlFormControl = new FormControl('');
  descriptionFormControl = new FormControl('');
  idFormControl = new FormControl('');

  formGroup = new FormGroup({
    title: this.titleFormControl,
    authors: this.authorsFormArray,
    venue: this.venueFormControl,
    date: this.dateFormControl,
    doi: this.doiFormControl,
    url: this.urlFormControl,
    description: this.descriptionFormControl,
    id: this.idFormControl,
  });

  get authorsArray(): FormArray {
    return this.formGroup.get('authors') as FormArray;
  }

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Initialize the editor
    this.editor = new Editor();

    // Populate form với dữ liệu hiện có nếu có
    if (this.publicationData) {
      this.formGroup.patchValue({
        title: this.publicationData.title || '',
        venue: this.publicationData.venue || '',
        date: this.publicationData.date || '',
        doi: this.publicationData.doi || '',
        url: this.publicationData.url || '',
        description: this.publicationData.description || '',
        id: this.publicationData.id || '',
      });

      // Handle authors array
      if (
        this.publicationData.authors &&
        this.publicationData.authors.length > 0
      ) {
        this.authorsFormArray.clear();
        this.publicationData.authors.forEach((author) => {
          this.authorsFormArray.push(new FormControl(author));
        });
      }
    }

    const isNewForm =
      !this.publicationData ||
      (!this.publicationData.title && !this.publicationData.venue);

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

    if (changes['publicationData'] && this.publicationData) {
      this.formGroup.patchValue({
        title: this.publicationData.title || '',
        venue: this.publicationData.venue || '',
        date: this.publicationData.date || '',
        doi: this.publicationData.doi || '',
        url: this.publicationData.url || '',
        description: this.publicationData.description || '',
        id: this.publicationData.id || '',
      });

      // Handle authors array
      if (
        this.publicationData.authors &&
        this.publicationData.authors.length > 0
      ) {
        this.authorsFormArray.clear();
        this.publicationData.authors.forEach((author) => {
          this.authorsFormArray.push(new FormControl(author));
        });
      }
    }
  }

  addAuthor(): void {
    this.authorsFormArray.push(new FormControl(''));
  }

  removeAuthor(index: number): void {
    if (this.authorsFormArray.length > 1) {
      this.authorsFormArray.removeAt(index);
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
    const formValue = this.formGroup.value;
    const publicationInfo: Publication = {
      ...formValue,
      authors:
        formValue.authors?.filter((author: string | null) => author?.trim()) ||
        [],
    } as Publication;

    this.formChange.emit(publicationInfo);
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

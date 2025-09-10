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
import { Interest } from '../../../../../../../models/cv-block.model';
import { Editor, Toolbar } from 'ngx-editor';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CvDeleteConfirmDialogComponent } from '../../../../../../../components/cv-delete-confirm-dialog/cv-delete-confirm-dialog.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor';

@Component({
  selector: 'app-interest-form-edit',
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
            <span class="interest-category">{{
              interestData?.category || 'Sở thích'
            }}</span>
            <span class="interest-items" *ngIf="interestData?.items?.length">
              {{ (interestData?.items || []).slice(0, 3).join(', ') }}
              <span *ngIf="(interestData?.items?.length || 0) > 3">...</span>
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
          <!-- Row 1: Category -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field full-width">
              <mat-label>Danh mục sở thích</mat-label>
              <input
                matInput
                formControlName="category"
                placeholder="Ví dụ: Thể thao, Âm nhạc, Du lịch"
              />
              <mat-error
                *ngIf="formGroup.get('category')?.hasError('required')"
              >
                Vui lòng nhập danh mục sở thích
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Row 2: Interest Items -->
          <div class="form-row">
            <mat-form-field appearance="outline" class="form-field full-width">
              <mat-label>Các sở thích cụ thể</mat-label>
              <mat-chip-grid #chipGrid aria-label="Interest selection">
                <mat-chip-row
                  *ngFor="let item of itemsFormControl.value"
                  (removed)="removeItem(item)"
                  [editable]="true"
                  [removable]="true"
                >
                  {{ item }}
                  <button matChipRemove [attr.aria-label]="'Xóa ' + item">
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip-row>
                <input
                  placeholder="Thêm sở thích..."
                  [matChipInputFor]="chipGrid"
                  [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                  (matChipInputTokenEnd)="addItem($event)"
                  #chipInput
                />
              </mat-chip-grid>
              <mat-hint>Nhấn Enter hoặc dấu phẩy để thêm sở thích</mat-hint>
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
                [placeholder]="'Thêm mô tả chi tiết về sở thích...'"
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
        margin-bottom: 20px !important; // Increased margin for interest forms
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
          padding: 20px 28px !important; // Increased padding for interest forms
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

          .interest-category {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            line-height: 1.3;
          }

          .interest-items {
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

      // Empty state styling for new interest
      .experience-expansion-panel:has(.interest-category:contains('Sở thích')) {
        border: 2px dashed #e0e0e0 !important;
        background-color: #fafafa !important;

        .interest-category {
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
        padding: 28px 0 !important; // Increased padding for interest forms
        background: transparent;

        .experience-form {
          .form-row {
            display: flex;
            gap: 20px; // Increased gap for interest forms
            margin-bottom: 20px; // Increased margin for interest forms

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
            margin-bottom: 20px; // Increased margin for interest forms
          }
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          padding-top: 24px; // Increased padding for interest forms
          border-top: 1px solid #e0e0e0;
          margin-top: 28px; // Increased margin for interest forms

          .save-button {
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 200px;
            padding: 14px 28px; // Increased padding for interest forms
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
          margin-top: 6px; // Increased margin for interest forms
        }
      }

      .editor-container {
        margin-top: 12px; // Increased margin for interest forms

        .editor-label {
          display: block;
          font-size: 14px;
          color: #666;
          margin-bottom: 12px; // Increased margin for interest forms
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
                min-height: 140px; // Increased height for interest forms
                padding: 20px; // Increased padding for interest forms
                font-size: 14px;
                line-height: 1.5;

                p {
                  margin: 0 0 10px 0; // Increased margin for interest forms

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
              padding: 10px 16px; // Increased padding for interest forms
              background-color: #f8f9fa;

              .NgxEditor__MenuItem {
                margin: 0 3px; // Increased margin for interest forms
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
export class InterestFormEditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() interestData: Interest | null = null;
  @Input() isReadOnly: boolean = false;
  @Input() forceCollapse: boolean = false;
  @Output() formChange = new EventEmitter<Interest>();
  @Output() deleteForm = new EventEmitter<void>();
  @Output() requestEdit = new EventEmitter<void>();
  @Output() editToggle = new EventEmitter<boolean>();

  formGroup!: FormGroup;
  itemsFormControl!: FormControl;
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

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  private subscriptions = new Subscription();
  isEditing = false;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.editor = new Editor();
    this.initializeForm();
    // Không tự động subscribe vào form changes
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['interestData'] && this.formGroup) {
      this.updateFormData();
    }
    if (changes['forceCollapse'] && this.forceCollapse) {
      this.isEditing = false;
      this.formGroup.disable();
    }
  }

  private initializeForm(): void {
    this.itemsFormControl = new FormControl(this.interestData?.items || []);

    this.formGroup = new FormGroup({
      category: new FormControl(this.interestData?.category || '', [
        Validators.required,
      ]),
      items: this.itemsFormControl,
      description: new FormControl(this.interestData?.description || ''),
      id: new FormControl(this.interestData?.id || this.generateId()),
    });

    // Kiểm tra nếu là form mới thì tự động mở để edit
    const isNewForm =
      !this.interestData ||
      (!this.interestData.category && !this.interestData.items?.length);
    if (isNewForm) {
      this.isEditing = true;
      this.formGroup.enable();
    } else {
      this.isEditing = false;
      this.formGroup.disable();
    }
  }

  private updateFormData(): void {
    if (this.interestData) {
      this.formGroup.patchValue({
        category: this.interestData.category || '',
        items: this.interestData.items || [],
        description: this.interestData.description || '',
        id: this.interestData.id || this.generateId(),
      });
      this.itemsFormControl.setValue(this.interestData.items || []);
    }
  }

  // Xóa setupFormSubscription method vì không cần tự động update

  addItem(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const currentItems = this.itemsFormControl.value || [];
      const updatedItems = [...currentItems, value];
      this.itemsFormControl.setValue(updatedItems);
      this.formGroup.patchValue({ items: updatedItems });
    }
    event.chipInput!.clear();
  }

  removeItem(item: string): void {
    const currentItems = this.itemsFormControl.value || [];
    const index = currentItems.indexOf(item);
    if (index >= 0) {
      const updatedItems = [...currentItems];
      updatedItems.splice(index, 1);
      this.itemsFormControl.setValue(updatedItems);
      this.formGroup.patchValue({ items: updatedItems });
    }
  }

  private generateId(): string {
    return (
      'interest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
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
    const interestInfo: Interest = {
      ...this.formGroup.value,
    } as Interest;

    this.formChange.emit(interestInfo);
    this.isEditing = false;
    this.editToggle.emit(false);
    this.formGroup.disable();
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(CvDeleteConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Xác nhận xóa',
        message: 'Bạn có chắc chắn muốn xóa sở thích này?',
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

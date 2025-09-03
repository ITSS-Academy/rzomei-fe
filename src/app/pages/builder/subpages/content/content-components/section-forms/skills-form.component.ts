import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { CVSection } from '../../services/cv-sections.service';
import { CvSectionsDataService } from '../../services/cv-sections-data.service';

@Component({
  selector: 'app-skills-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSliderModule,
    MatSelectModule,
  ],
  template: `
    <div class="skills-section">
      <h4>Kỹ năng và trình độ</h4>

      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Danh mục kỹ năng</mat-label>
          <input
            matInput
            [value]="data?.category || ''"
            (input)="updateData('category', $event)"
            placeholder="Programming Languages, Frontend Technologies..."
          />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Trình độ</mat-label>
          <mat-select
            [value]="data?.level || ''"
            (selectionChange)="updateData('level', $event.value)"
          >
            <mat-option value="Beginner">Mới bắt đầu</mat-option>
            <mat-option value="Amateur">Nghiệp dư</mat-option>
            <mat-option value="Proficient">Thành thạo</mat-option>
            <mat-option value="Expert">Chuyên gia</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Các kỹ năng</mat-label>
        <input
          matInput
          [value]="data?.items ? data.items.join(', ') : ''"
          (input)="updateSkillItems($event)"
          placeholder="JavaScript, TypeScript, React, Node.js (phân cách bằng dấu phẩy)"
        />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Mô tả</mat-label>
        <textarea
          matInput
          rows="3"
          [value]="data?.description || ''"
          (input)="updateData('description', $event)"
          placeholder="Mô tả về trình độ và kinh nghiệm với các kỹ năng này..."
        ></textarea>
      </mat-form-field>

      <!-- Debug info -->
      <div class="debug-info" style="margin-top: 16px; padding: 8px; background: #f5f5f5; border-radius: 4px;">
        <small>Section ID: {{ section.instanceId }}</small>
      </div>
    </div>
  `,
  styleUrls: ['./section-forms.scss'],
})
export class SkillsFormComponent {
  @Input() section!: CVSection;
  @Input() data: any = {};
  @Output() dataChange = new EventEmitter<any>();

  constructor(private cvSectionsDataService: CvSectionsDataService) {}

  updateSkillItems(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const items = value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item);
    const updatedData = { ...this.data, items };
    this.dataChange.emit(updatedData);

    // Sử dụng section.instanceId để phân biệt các skill sections
    this.cvSectionsDataService.updateSectionData(
      this.section.instanceId || this.section.id, 
      'skills', 
      updatedData
    );
  }

  updateData(field: string, value: any): void {
    if (typeof value === 'object' && value.target) {
      value = value.target.value;
    }
    const updatedData = { ...this.data, [field]: value };
    this.dataChange.emit(updatedData);

    // Sử dụng section.instanceId
    this.cvSectionsDataService.updateSectionData(
      this.section.instanceId || this.section.id, 
      'skills', 
      updatedData
    );
  }
}
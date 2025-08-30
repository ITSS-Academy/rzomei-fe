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
    MatSelectModule
  ],
  template: `
    <div class="skills-section">
      <h4>Kỹ năng và trình độ</h4>
      
      <div class="skills-list">
        @for (skill of data?.skills || []; track skill.name) {
          <div class="skill-item">
            <div class="skill-header">
              <mat-form-field appearance="outline" class="skill-name">
                <mat-label>Tên kỹ năng</mat-label>
                <input matInput [value]="skill.name" (input)="updateSkill($index, 'name', $event)" />
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="skill-level">
                <mat-label>Trình độ</mat-label>
                <mat-select [value]="skill.level" (selectionChange)="updateSkill($index, 'level', $event.value)">
                  <mat-option value="beginner">Mới bắt đầu</mat-option>
                  <mat-option value="intermediate">Trung bình</mat-option>
                  <mat-option value="advanced">Nâng cao</mat-option>
                  <mat-option value="expert">Chuyên gia</mat-option>
                </mat-select>
              </mat-form-field>
              
              <button mat-icon-button color="warn" (click)="removeSkill($index)" class="remove-skill">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
            
            <div class="skill-progress">
              <mat-slider
                [min]="0"
                [max]="100"
                [step]="10"
                (input)="updateSkill($index, 'percentage', $event)"
                discrete
                showTickMarks>
                <input matSliderThumb [value]="skill.percentage || 0">
              </mat-slider>
              <span class="progress-label">{{skill.percentage || 0}}%</span>
            </div>
          </div>
        } @empty {
          <p class="empty-state">Chưa có kỹ năng nào. Hãy thêm kỹ năng đầu tiên!</p>
        }
      </div>

      <button mat-stroked-button color="primary" (click)="addSkill()" class="add-skill-btn">
        <mat-icon>add</mat-icon>
        Thêm kỹ năng
      </button>

      <div class="skill-categories">
        <h5>Phân loại kỹ năng</h5>
        <mat-form-field appearance="outline">
          <mat-label>Kỹ năng kỹ thuật</mat-label>
          <input matInput [value]="data?.technicalSkills || ''" 
                 (input)="updateData('technicalSkills', $event)"
                 placeholder="JavaScript, Python, React..." />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Kỹ năng mềm</mat-label>
          <input matInput [value]="data?.softSkills || ''" 
                 (input)="updateData('softSkills', $event)"
                 placeholder="Giao tiếp, Lãnh đạo, Giải quyết vấn đề..." />
        </mat-form-field>
      </div>
    </div>
  `,
  styleUrls: ['./section-forms.scss']
})
export class SkillsFormComponent {
  @Input() section!: CVSection;
  @Input() data: any = { skills: [] };
  @Output() dataChange = new EventEmitter<any>();

  addSkill(): void {
    const newSkill = {
      name: '',
      level: 'intermediate',
      percentage: 50
    };
    const updatedSkills = [...(this.data.skills || []), newSkill];
    this.updateData('skills', updatedSkills);
  }

  removeSkill(index: number): void {
    const updatedSkills = this.data.skills.filter((_: any, i: number) => i !== index);
    this.updateData('skills', updatedSkills);
  }

  updateSkill(index: number, field: string, value: any): void {
    if (typeof value === 'object' && value.target) {
      value = value.target.value;
    }
    
    const updatedSkills = [...this.data.skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    this.updateData('skills', updatedSkills);
  }

  updateData(field: string, value: any): void {
    if (typeof value === 'object' && value.target) {
      value = value.target.value;
    }
    const updatedData = { ...this.data, [field]: value };
    this.dataChange.emit(updatedData);
  }
}

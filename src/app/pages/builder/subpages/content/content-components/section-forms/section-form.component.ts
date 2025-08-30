import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CVSection } from '../../services/cv-sections.service';
import { PersonalFormComponent } from './personal-form.component';
import { EducationFormComponent } from './education-form.component';
import { ExperienceFormComponent } from './experience-form.component';
import { SkillsFormComponent } from './skills-form.component';
import { ProjectsFormComponent } from './projects-form.component';
import { LanguagesFormComponent } from './languages-form.component';
import { CertificatesFormComponent } from './certificates-form.component';

@Component({
  selector: 'app-section-form',
  standalone: true,
  imports: [
    CommonModule,
    PersonalFormComponent,
    EducationFormComponent,
    ExperienceFormComponent,
    SkillsFormComponent,
    ProjectsFormComponent,
    LanguagesFormComponent,
    CertificatesFormComponent
  ],
  template: `
    <div class="section-form-container">
      @switch (section.type) {
        @case ('personal') {
          <app-personal-form 
            [section]="section" 
            [data]="data" 
            (dataChange)="onDataChange($event)">
          </app-personal-form>
        }
        @case ('education') {
          <app-education-form 
            [section]="section" 
            [data]="data" 
            (dataChange)="onDataChange($event)">
          </app-education-form>
        }
        @case ('experience') {
          <app-experience-form 
            [section]="section" 
            [data]="data" 
            (dataChange)="onDataChange($event)">
          </app-experience-form>
        }
        @case ('skills') {
          <app-skills-form 
            [section]="section" 
            [data]="data" 
            (dataChange)="onDataChange($event)">
          </app-skills-form>
        }
        @case ('projects') {
          <app-projects-form 
            [section]="section" 
            [data]="data" 
            (dataChange)="onDataChange($event)">
          </app-projects-form>
        }
        @case ('languages') {
          <app-languages-form 
            [section]="section" 
            [data]="data" 
            (dataChange)="onDataChange($event)">
          </app-languages-form>
        }
        @case ('certificates') {
          <app-certificates-form 
            [section]="section" 
            [data]="data" 
            (dataChange)="onDataChange($event)">
          </app-certificates-form>
        }
        @default {
          <div class="section-placeholder">
            <p>Form cho {{ section.title }} sẽ được phát triển sớm</p>
            <small>Section type: {{ section.type }}</small>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .section-form-container {
      padding: 0;
    }
    
    .section-placeholder {
      padding: 2rem;
      text-align: center;
      color: var(--text-secondary);
      background: var(--surface-color);
      border-radius: 8px;
      border: 1px dashed var(--border-color);
      
      p {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
      }
      
      small {
        color: var(--text-tertiary);
        font-size: 0.8rem;
      }
    }
  `]
})
export class SectionFormComponent {
  @Input() section!: CVSection;
  @Input() data: any = {};
  @Output() dataChange = new EventEmitter<any>();

  onDataChange(newData: any): void {
    this.dataChange.emit(newData);
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CVSection } from '../../services/cv-sections.service';
import { PersonalFormComponent } from './personal-form.component';
import { CertificatesFormComponent } from './certificates-form.component';
import { EducationFormComponent } from './education-form.component';
import { ExperienceFormComponent } from './experience-form.component';
import { LanguagesFormComponent } from './languages-form.component';
import { ProjectsFormComponent } from './projects-form.component';
import { SkillsFormComponent } from './skills-form.component';
// import { SummaryFormComponent } from './summary-form.component';

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
    // SummaryFormComponent,
    CertificatesFormComponent,
  ],
  template: `
    <div class="section-form-container">
      @switch (section.type) { @case ('personal') {
      <app-personal-form
        
      ></app-personal-form>
      } 
      @case ('education') {
      <app-education-form
        [section]="section"
        [data]="data"
      ></app-education-form>
      } @case ('experience') {
      <app-experience-form
        [section]="section"
        [data]="data"
      ></app-experience-form>
      } @case ('skills') {
      <app-skills-form
        [section]="section"
        [data]="data"
      ></app-skills-form>
      } @case ('projects') {
      <app-projects-form
        [section]="section"
        [data]="data"
      ></app-projects-form>
      } @case ('languages') {
      <app-languages-form
        [section]="section"
        [data]="data"
      ></app-languages-form>
      } @case ('certificates') {
      <app-certificates-form
        [section]="section"
        [data]="data"
      ></app-certificates-form>
      } @default {
      <div class="section-placeholder">
        <p>Form cho {{ section.title }} sẽ được phát triển sớm</p>
        <small>Section type: {{ section.type }}</small>
      </div>
      }
    }
    </div>
  `,
})
export class SectionFormComponent {
  @Input() section!: CVSection;
  @Input() data: any = {};
  @Output() dataChange = new EventEmitter<any>();

  onDataChange(newData: any): void {
    this.dataChange.emit(newData);
  }
}

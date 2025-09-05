import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificatesFormComponent } from './certificates-form.component';
import { EducationFormComponent } from './education-form.component';
import { ExperienceFormComponent } from './experience-form.component';
import { LanguagesFormComponent } from './languages-form.component';
import { PersonalFormComponent } from './personal-form.component';
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
      @switch (section.type) {
        @case ('personalInfo') {
          <app-personal-form></app-personal-form>
        }
        @case ('experience') {
          <app-experience-form></app-experience-form>
        }
        @case ('education') {
          <app-education-form></app-education-form>
        }
        @case ('certifications') {
          <app-certificates-form></app-certificates-form>
        }
        @case ('skills') {
          <app-skills-form></app-skills-form>
        }
        @case ('projects') {
          <app-projects-form></app-projects-form>
        }
        @case ('languages') {
          <app-languages-form></app-languages-form>
        }
      }
    </div>
  `,
})
export class SectionFormComponent implements OnInit{
  @Input() section!: any;
  @Input() index!: number;

  ngOnInit(): void {
    
  }
}

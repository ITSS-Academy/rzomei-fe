import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { addCvSection } from '../../ngrx/cv-section/cv-section.actions';
import { CommonModule } from '@angular/common';

// Import các form edit components
import { EducationFormEditComponent } from '../../pages/builder/subpages/content/content-components/section-forms/education-form/education-form-edit.component';
import { ExperienceFormEditComponent } from '../../pages/builder/subpages/content/content-components/section-forms/experience-form/experience-form-edit.component';
import { SkillFormEditComponent } from '../../pages/builder/subpages/content/content-components/section-forms/skill-form/skill-form-edit.component';
import { ProjectFormEditComponent } from '../../pages/builder/subpages/content/content-components/section-forms/project-form/project-form-edit.component';
import { AwardFormEditComponent } from '../../pages/builder/subpages/content/content-components/section-forms/award-form/award-form-edit.component';
import { LanguageFormEditComponent } from '../../pages/builder/subpages/content/content-components/section-forms/language-form/language-form-edit.component';
import { InterestFormEditComponent } from '../../pages/builder/subpages/content/content-components/section-forms/interest-form/interest-form-edit.component';
import { CourseFormEditComponent } from '../../pages/builder/subpages/content/content-components/section-forms/course-form/course-form-edit.component';
import { OrganizationFormEditComponent } from '../../pages/builder/subpages/content/content-components/section-forms/organization-form/organization-form-edit.component';
import { CertificationFormEditComponent } from '../../pages/builder/subpages/content/content-components/section-forms/certification-form/certification-form-edit.component';
import { ReferenceFormEditComponent } from '../../pages/builder/subpages/content/content-components/section-forms/reference-form/reference-form-edit.component';
import { PublicationFormEditComponent } from '../../pages/builder/subpages/content/content-components/section-forms/publication-form/publication-form-edit.component';

export interface ContentType {
  icon: string;
  title: string;
  description: string;
  value: string;
}

export interface DialogData {
  title: string;
}

@Component({
  selector: 'app-cv-content-dialog',
  standalone: true,
  imports: [
    MaterialModule, 
    CommonModule
  ],
  templateUrl: './cv-content-dialog.component.html',
  styleUrl: './cv-content-dialog.component.scss',
})
export class CvContentDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CvContentDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  // cv-content-dialog.component.ts
contentTypes: ContentType[] = [
  {
    icon: 'person',
    title: 'Thông tin cá nhân',
    description: 'Thông tin liên lạc cơ bản',
    value: 'profile',
  },
  {
    icon: 'school',
    title: 'Học vấn',
    description: 'Nền tảng học thuật và bằng cấp',
    value: 'education',
  },
  {
    icon: 'work',
    title: 'Kinh nghiệm làm việc',
    description: 'Lịch sử công việc chuyên môn',
    value: 'experience',
  },
  {
    icon: 'psychology',
    title: 'Kỹ năng',
    description: 'Kỹ năng kỹ thuật và mềm',
    value: 'skills',
  },
  {
    icon: 'folder',
    title: 'Dự án',
    description: 'Các dự án và thành tựu',
    value: 'projects',
  },
  {
    icon: 'military_tech',
    title: 'Giải thưởng',
    description: 'Thành tựu và giải thưởng',
    value: 'awards',
  },
  {
    icon: 'verified',
    title: 'Chứng chỉ',
    description: 'Chứng chỉ chuyên môn',
    value: 'certifications',
  },
  {
    icon: 'language',
    title: 'Ngôn ngữ',
    description: 'Ngôn ngữ bạn nói và trình độ',
    value: 'languages',
  },
  {
    icon: 'interests',
    title: 'Sở thích & Thú vui',
    description: 'Sở thích và thú vui cá nhân',
    value: 'interests',
  },
  {
    icon: 'school',
    title: 'Khóa học & Đào tạo',
    description: 'Khóa học bổ sung và đào tạo đã hoàn thành',
    value: 'courses',
  },
  {
    icon: 'groups',
    title: 'Tổ chức',
    description: 'Tổ chức chuyên môn và công việc tình nguyện',
    value: 'organizations',
  },
  {
    icon: 'article',
    title: 'Xuất bản',
    description: 'Công trình nghiên cứu và xuất bản',
    value: 'publications',
  },
  {
    icon: 'contacts',
    title: 'Người tham chiếu',
    description: 'Người tham chiếu chuyên môn có thể xác nhận công việc',
    value: 'references',
  },
  {
    icon: 'assignment',
    title: 'Tuyên bố',
    description: 'Tuyên bố chính thức về tính xác thực',
    value: 'declaration',
  },
];

  onClose(): void {
    this.dialogRef.close();
  }

  onSelectContent(contentType: ContentType): void {
    // Đóng dialog và trả về content type đã chọn
    this.dialogRef.close({
      action: 'add',
      contentType: contentType.value
    });
  }
}

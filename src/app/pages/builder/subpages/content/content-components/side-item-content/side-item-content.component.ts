import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MaterialModule } from '../../../../../../shared/material/material.module';
import { CvSectionState } from '../../../../../../ngrx/cv-section/cv-section.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PersonalFormComponent } from '../section-forms/personal-form/personal-form.component';
import { EducationFormComponent } from '../section-forms/education-form/education-form.component';
import { ExperienceFormComponent } from '../section-forms/experience-form/experience-form.component';
import { SkillFormComponent } from '../section-forms/skill-form/skill-form.component';
import { ProjectFormComponent } from '../section-forms/project-form/project-form.component';
import { AwardFormComponent } from '../section-forms/award-form/award-form.component';
import { LanguageFormComponent } from '../section-forms/language-form/language-form.component';
import { InterestFormComponent } from '../section-forms/interest-form/interest-form.component';
import { CourseFormComponent } from '../section-forms/course-form/course-form.component';
import { ReferenceFormComponent } from '../section-forms/reference-form/reference-form.component';
import { PublicationFormComponent } from '../section-forms/publication-form/publication-form.component';
import { DeclarationFormComponent } from '../section-forms/declaration-form/declaration-form.component';
import { MatDialog } from '@angular/material/dialog';
import {
  CvContentDialogComponent,
  ContentType,
} from '../../../../../..//components/cv-content-dialog/cv-content-dialog.component';
import * as CvSectionActions from '../../../../../../ngrx/cv-section/cv-section.actions';

import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { SectionOrderPipe } from './section-order.pipe';
import { CVBlock } from '../../../../../../models/cv-block.model';
import { OrganizationFormComponent } from '../section-forms/organization-form/organization-form.component';
import { CertificationFormComponent } from '../section-forms/certification-form/certification-form.component';
import { C } from '@angular/cdk/keycodes';
import { AuthState } from '../../../../../../ngrx/auth/auth.state';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-side-item-content',
  imports: [
    MaterialModule,
    KeyValuePipe,
    PersonalFormComponent,
    EducationFormComponent,
    ExperienceFormComponent,
    SkillFormComponent,
    ProjectFormComponent,
    AwardFormComponent,
    LanguageFormComponent,
    InterestFormComponent,
    CourseFormComponent,
    OrganizationFormComponent,
    CertificationFormComponent,
    ReferenceFormComponent,
    PublicationFormComponent,
    DeclarationFormComponent,
    AsyncPipe,
    SectionOrderPipe,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './side-item-content.component.html',
  styleUrl: './side-item-content.component.scss',
})
export class SideItemContentComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  cvData$!: Observable<CVBlock | null>;
  authState$!: Observable<string | null>;
  cvSections$!: Observable<any | null>;
  isLoading$!: Observable<boolean>;
  isDataLoaded = false;
  blocks: any[] = [];
  dataCV: any;

  // Định nghĩa thứ tự sections mong muốn
  sectionOrder = [
    'personalInfo',
    'education',
    'experience',
    'skills',
    'projects',
    'languages',
    'certifications',
    'awards',
    'interests',
    'courses',
    'organizations',
    'publications',
    'references',
    'declaration',
    'customSections',
  ];
  id = 0;

  constructor(
    private store: Store<{ cvSections: CvSectionState; auth: AuthState }>,
    private activeRoute: ActivatedRoute
  ) {
    this.cvSections$ = this.store.select('cvSections', 'sections');
    this.authState$ = this.store.select('auth', 'token');
    this.isLoading$ = this.store.select('cvSections', 'isGetSectionLoading');
    
  }

  ngOnInit(): void {
    
    this.authState$.subscribe((token) => {
      if (token) {
        this.cvSections$.subscribe((data) => {
          if (data) {
            const { id } = this.activeRoute.parent?.snapshot.params!;
            this.isDataLoaded = true;
            this.store.dispatch(CvSectionActions.generateCv({ data: {data, id}}));
            this.dataCV = data;

            // Chuyển đổi object thành mảng key-value
            this.blocks = Object.keys(data).map((key) => ({
              key,
              value: data[key],
            }));
          } else {
            this.isDataLoaded = false;
          }
        });
      }
    });
  }

  hasData(sectionData: any): boolean {
    if (!sectionData) return false;

    // Nếu là array, kiểm tra length > 0
    if (Array.isArray(sectionData)) {
      return sectionData.length > 0;
    }

    // Nếu là object, kiểm tra có properties không
    if (typeof sectionData === 'object') {
      return (
        Object.keys(sectionData).length > 0 &&
        Object.values(sectionData).some(
          (value) => value !== null && value !== undefined && value !== ''
        )
      );
    }

    // Nếu là primitive, kiểm tra có giá trị không
    return (
      sectionData !== null && sectionData !== undefined && sectionData !== ''
    );
  }

  openAddContentDialog(): void {
    const dialogRef = this.dialog.open(CvContentDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'add') {
        console.log('Adding content type:', result.contentType);
        this.addNewFormComponent(result.contentType);
      }
    });
  }

  private addNewFormComponent(contentType: string): void {
    // Tạo data mẫu cho form mới
    const newFormData = this.generateNewFormData(contentType);

    // Dispatch action để thêm vào store
    this.store.dispatch(
      CvSectionActions.addCvSection({
        sectionType: contentType as any,
        section: newFormData,
        sectionForRender: {
          type: contentType,
          title: this.getContentTypeTitle(contentType),
          description: '',
          icon: this.getContentTypeIcon(contentType),
          data: newFormData,
        },
      })
    );

    console.log(`Added new ${contentType} form with data:`, newFormData);
  }

  private generateNewFormData(sectionType: string): any {
    const baseData = {
      id: this.generateId(),
    };

    switch (sectionType) {
      case 'education':
        return {
          ...baseData,
          degree: '', // Empty để form hiển thị nhưng có data
          institution: '',
          location: '',
          startDate: '',
          endDate: '',
          gpa: '',
          description: '',
        };

      case 'experience':
        return {
          ...baseData,
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        };

      case 'skills':
        return {
          ...baseData,
          category: '',
          level: '',
          items: [],
          description: '',
        };

      case 'projects':
        return {
          ...baseData,
          title: '',
          description: '',
          technologies: [],
          url: '',
          github: '',
          startDate: '',
          endDate: '',
        };

      case 'awards':
        return {
          ...baseData,
          title: '',
          issuer: '',
          dateReceived: '',
          expiryDate: '',
          description: '',
          verificationUrl: '',
        };

      case 'languages':
        return {
          ...baseData,
          language: '',
          level: '',
          certification: '',
          score: '',
          description: '',
        };

      case 'interests':
        return {
          ...baseData,
          category: '',
          items: [],
          description: '',
        };

      case 'courses':
        return {
          ...baseData,
          title: '',
          provider: '',
          duration: '',
          completionDate: '',
          certificateUrl: '',
          description: '',
        };

      case 'organizations':
        return {
          ...baseData,
          name: '',
          role: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        };

      case 'certifications':
        return {
          ...baseData,
          title: '',
          issuer: '',
          dateReceived: '',
          expiryDate: '',
          description: '',
          verificationUrl: '',
        };

      case 'references':
        return {
          ...baseData,
          name: '',
          title: '',
          company: '',
          email: '',
          phone: '',
          relationship: '',
        };

      case 'publications':
        return {
          ...baseData,
          title: '',
          authors: [''],
          venue: '',
          date: '',
          doi: '',
          url: '',
          description: '',
        };

      case 'declaration':
        return {
          ...baseData,
          statement: '',
          place: '',
          date: '',
          signature: '',
        };

      case 'customSections':
        return {
          ...baseData,
          title: '',
          subtitle: '',
          content: '',
          url: '',
        };

      default:
        return baseData;
    }
  }

  private getContentTypeTitle(contentType: string): string {
    const titleMap: { [key: string]: string } = {
      education: 'Học vấn',
      experience: 'Kinh nghiệm làm việc',
      skills: 'Kỹ năng',
      projects: 'Dự án',
      awards: 'Giải thưởng',
      languages: 'Ngôn ngữ',
      interests: 'Sở thích & Thú vui',
      courses: 'Khóa học & Đào tạo',
      organizations: 'Tổ chức',
      certifications: 'Chứng chỉ',
      references: 'Người tham chiếu',
      publications: 'Xuất bản',
      declaration: 'Tuyên bố',
      customSections: 'Nội dung tùy chỉnh',
    };
    return titleMap[contentType] || contentType;
  }

  private getContentTypeIcon(contentType: string): string {
    const iconMap: { [key: string]: string } = {
      education: 'school',
      experience: 'work',
      skills: 'psychology',
      projects: 'folder',
      awards: 'military_tech',
      languages: 'language',
      interests: 'interests',
      courses: 'school',
      organizations: 'groups',
      certifications: 'verified',
      references: 'contacts',
      publications: 'article',
      declaration: 'assignment',
      customSections: 'add_box',
    };
    return iconMap[contentType] || 'help';
  }

  private generateId(): string {
    return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
}

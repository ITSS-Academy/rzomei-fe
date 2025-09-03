import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../../../shared/material/material.module';
import {
  CvSectionsService,
  CVSection,
} from '../../services/cv-sections.service';

import * as CvSectionsActions from '../../../../../../ngrx/cv-section/cv-section.actions';
import { CvSectionState } from '../../../../../../ngrx/cv-section/cv-section.state';
import { Store } from '@ngrx/store';
import { PersonalFormComponent } from '../section-forms/personal-form.component';
@Component({
  selector: 'app-side-tool-content',
  imports: [MaterialModule],
  templateUrl: './side-tool-content.component.html',
  styleUrl: './side-tool-content.component.scss',
})
export class SideToolContentComponent {
  isCollapsed = false;

  constructor(
    private cvSectionsService: CvSectionsService,
    private store: Store<{cvSections: CvSectionState}>
  ) {}
  sectionTemplates: CVSection[] = [
    {
      id: 'personal',
      icon: 'person',
      title: 'Thông tin cá nhân',
      desc: 'Thông tin liên lạc cơ bản',
      type: 'personal',
      isActive: true, // Luôn có sẵn
      order: 1,
      canDuplicate: true // Có thể có nhiều thông tin cá nhân
    },
    {
      id: 'education',
      icon: 'school',
      title: 'Học vấn',
      desc: 'Nền tảng học thuật và bằng cấp',
      type: 'education',
      isActive: false,
      order: 2,
      canDuplicate: true // Có thể có nhiều bằng cấp
    },
    {
      id: 'experience',
      icon: 'work',
      title: 'Kinh nghiệm làm việc',
      desc: 'Lịch sử công việc chuyên môn',
      type: 'experience',
      isActive: false,
      order: 3,
      canDuplicate: true // Có thể có nhiều công việc
    },
    {
      id: 'skills',
      icon: 'psychology',
      title: 'Kỹ năng',
      desc: 'Kỹ năng kỹ thuật và mềm',
      type: 'skills',
      isActive: false,
      order: 4,
      canDuplicate: true // Có thể có nhiều kỹ năng
    },
    {
      id: 'projects',
      icon: 'assignment',
      title: 'Dự án',
      desc: 'Các dự án và thành tựu',
      type: 'projects',
      isActive: false,
      order: 5,
      canDuplicate: true // Có thể có nhiều dự án
    },
    {
      id: 'certificates',
      icon: 'emoji_events',
      title: 'Chứng chỉ',
      desc: 'Thành tựu và chứng chỉ',
      type: 'certificates',
      isActive: false,
      order: 6,
      canDuplicate: true // Có thể có nhiều chứng chỉ
    },
    {
      id: 'languages',
      icon: 'language',
      title: 'Ngôn ngữ',
      desc: 'Ngôn ngữ bạn nói và trình độ',
      type: 'languages',
      isActive: false,
      order: 7,
      canDuplicate: true // Có thể có nhiều ngôn ngữ
    }
  ];

  // ngOnInit() {
  //   // Lấy các blocks có thể thêm (chưa active)
  //   this.cvSectionsService.sections$.subscribe((sections) => {
  //     this.availableBlocks = this.cvSectionsService.getAvailableSections();
  //     this.currentSections = sections.filter((s) => s.isActive);
  //   });
  // }

  // toggleSidebar() {
  //   this.isCollapsed = !this.isCollapsed;
  // }

  // // Thêm block vào CV
  addBlock(section: any) {
    switch (section.type) {
      case 'personal':
        this.store.dispatch(CvSectionsActions.addCvPersonalSection({ section: {
          type: section.type,
          personalInfo: {
            name: '',
            title: '',
            email: '',
            phone: '',
            address: '',
            website: '',
            linkedin: '',
            github: '',
            photoUrl: '',
            summary: '',
          },
        } }));
        break;
      case 'education':
        this.store.dispatch(CvSectionsActions.addCvEducationSections({ section: {
          type: section.type,
          education: [
            {
               "degree": "Master of Software Engineering",
              "institution": "FPT University",
              "location": "Hà Nội, Việt Nam",
              "startDate": "2018-09",
              "gpa": "3.9/4.0",
              "description": "Specialized in Advanced Software Architecture and AI/ML applications. Thesis: 'Microservices Architecture for Large-Scale Web Applications'."
            }
          ]
        } }));
        break;
    }
  }

}

import { Component } from '@angular/core';
import { MaterialModule } from '../../../../../../shared/material/material.module';

import * as CvSectionsActions from '../../../../../../ngrx/cv-section/cv-section.actions';
import { CvSectionState } from '../../../../../../ngrx/cv-section/cv-section.state';
import { Store } from '@ngrx/store';
import { CVBlockForRendering } from '../../../../../../models/cv-block.model';
@Component({
  selector: 'app-side-tool-content',
  imports: [MaterialModule],
  templateUrl: './side-tool-content.component.html',
  styleUrl: './side-tool-content.component.scss',
})
export class SideToolContentComponent {
  isCollapsed = false;

  constructor(
    private store: Store<{cvSections: CvSectionState}>
  ) {}
  sectionTemplates: CVBlockForRendering[] = [
    {
      type: 'personalInfo',
      icon: 'person',
      title: 'Thông tin cá nhân',
      description: 'Thông tin cá nhân của bạn',
      data: {}
      
    },
    {
      type: 'education',
      icon: 'school',
      title: 'Học vấn',
      description: 'Thông tin về quá trình học tập của bạn',
      data: {}
    },
    {
      type: 'experience',
      icon: 'work',
      title: 'Kinh nghiệm làm việc',
      description: 'Thông tin về kinh nghiệm làm việc của bạn',
      data: {}
    },
    {
      type: 'skills',
      icon: 'star',
      title: 'Kỹ năng',
      description: 'Thông tin về các kỹ năng của bạn',
      data: {}
    },
    {
      type: 'projects',
      icon: 'assignment',
      title: 'Dự án',
      description: 'Thông tin về các dự án bạn đã tham gia',
      data: {}
    },
    // {
    //   type: 'awards',
    //   icon: 'emoji_events',
    //   title: 'Giải thưởng',
    //   description: 'Thông tin về các giải thưởng bạn đã nhận',
    //   data: {}
    // },
    {
      type: 'languages',
      icon: 'language',
      title: 'Ngôn ngữ',
      description: 'Thông tin về các ngôn ngữ bạn biết',
      data: {}
    },
    // {
    //   type: 'interests',
    //   icon: 'favorite',
    //   title: 'Sở thích',
    //   description: 'Thông tin về các sở thích của bạn',
    //   data: {}
    // },
    // {
    //   type: 'courses',
    //   icon: 'school',
    //   title: 'Khóa học',
    //   description: 'Thông tin về các khóa học bạn đã tham gia',
    //   data: {}
    // },
    // {
    //   type: 'organizations',
    //   icon: 'business',
    //   title: 'Tổ chức',
    //   description: 'Thông tin về các tổ chức bạn đã tham gia',
    //   data: {}
    // },
    // {
    //   type: 'publications',
    //   icon: 'article',
    //   title: 'Công bố',
    //   description: 'Thông tin về các công bố của bạn',
    //   data: {}
    // },
    // {
    //   type: 'references',
    //   icon: 'people',
    //   title: 'Người tham khảo',
    //   description: 'Thông tin về các người tham khảo của bạn',
    //   data: {}
    // },
    // {
    //   type: 'certifications',
    //   icon: 'verified',
    //   title: 'Chứng chỉ',
    //   description: 'Thông tin về các chứng chỉ bạn đã đạt được',
    //   data: {}
    // },
    // {
    //   type: 'declaration',
    //   icon: 'description',
    //   title: 'Tuyên bố',
    //   description: 'Thông tin về tuyên bố của bạn',
    //   data: {}
    // },
    // {
    //   type: 'customSections',
    //   icon: 'note',
    //   title: 'Phần tùy chỉnh',
    //   description: 'Thông tin về các phần tùy chỉnh của bạn',
    //   data: {}
    // }
  ];



  // Thêm block vào CV
  addBlock(section: CVBlockForRendering) {
    this.store.dispatch(CvSectionsActions.addCvSection({ 
      section: section.data,
      sectionForRender: {
        type: section.type,
        icon: section.icon,
        title: section.title,
        description: section.description,
      }, 
      sectionType: section.type}));
  }

}
function uuidv4(): string {
  // Generates a RFC4122 version 4 UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


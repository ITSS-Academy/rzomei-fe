import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../../../shared/material/material.module';
import { CvSectionsService, CVSection } from '../../services/cv-sections.service';
import { SectionFormComponent } from '../section-forms/section-form.component';

@Component({
  selector: 'app-side-item-content',
  imports: [MaterialModule, SectionFormComponent],
  templateUrl: './side-item-content.component.html',
  styleUrl: './side-item-content.component.scss',
})
export class SideItemContentComponent implements OnInit {
  sections: CVSection[] = [];
  sectionData: { [instanceId: string]: any } = {};

  constructor(private cvSectionsService: CvSectionsService) {}

  ngOnInit() {
    // Subscribe để cập nhật sections khi có thay đổi
    this.cvSectionsService.sections$.subscribe(sections => {
      this.sections = this.cvSectionsService.getActiveSections();
    });
  }

  // Toggle section expand/collapse
  toggleSection(instanceId: string) {
    this.cvSectionsService.toggleSection(instanceId);
  }

  // Xóa section khỏi CV
  removeSection(instanceId: string) {
    this.cvSectionsService.removeSection(instanceId);
  }

  // Cập nhật data cho section
  onSectionDataChange(instanceId: string, data: any): void {
    this.sectionData[instanceId] = data;
    // TODO: Gửi data về service hoặc lưu vào database
    console.log(`Data updated for ${instanceId}:`, data);
  }

  // Lấy data cho section
  getSectionData(instanceId: string): any {
    return this.sectionData[instanceId] || {};
  }
}

import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../../../shared/material/material.module';
import { CvSectionsService, CVSection } from '../../services/cv-sections.service';

@Component({
  selector: 'app-side-item-content',
  imports: [MaterialModule],
  templateUrl: './side-item-content.component.html',
  styleUrl: './side-item-content.component.scss',
})
export class SideItemContentComponent implements OnInit {
  sections: CVSection[] = [];

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
}

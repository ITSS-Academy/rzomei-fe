import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../../../shared/material/material.module';
import { CvSectionsService, CVSection } from '../../services/cv-sections.service';

@Component({
  selector: 'app-side-tool-content',
  imports: [MaterialModule],
  templateUrl: './side-tool-content.component.html',
  styleUrl: './side-tool-content.component.scss',
})
export class SideToolContentComponent implements OnInit {
  isCollapsed = false;
  availableBlocks: CVSection[] = [];

  constructor(private cvSectionsService: CvSectionsService) {}

  ngOnInit() {
    // Lấy các blocks có thể thêm (chưa active)
    this.cvSectionsService.sections$.subscribe(sections => {
      this.availableBlocks = this.cvSectionsService.getAvailableSections();
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  // Thêm block vào CV
  addBlock(blockId: string) {
    this.cvSectionsService.addSection(blockId);
  }
}

// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { CvSectionsDataService } from '../../services/cv-sections-data.service';

// @Component({
//   selector: 'app-summary-form',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatFormFieldModule,
//     MatInputModule
//   ],
//   template: `
//     <div class="summary-section">
//       <h4>Tóm tắt nghề nghiệp</h4>
      
//       <mat-form-field appearance="outline" class="full-width">
//         <mat-label>Tóm tắt</mat-label>
//         <textarea
//           matInput
//           rows="6"
//           [value]="data?.summary || ''"
//           (input)="updateData('summary', $event)"
//           placeholder="Mô tả ngắn gọn về kinh nghiệm, kỹ năng và mục tiêu nghề nghiệp của bạn..."
//         ></textarea>
//       </mat-form-field>
//     </div>
//   `,
//   styleUrls: ['./section-forms.scss']
// })
// export class SummaryFormComponent {
//   @Input() section!: CVSection;
//   @Input() data: any = {};
//   @Output() dataChange = new EventEmitter<any>();

//   constructor(private cvSectionsDataService: CvSectionsDataService) {}

//   updateData(field: string, event: Event): void {
//     const value = (event.target as HTMLTextAreaElement).value;
//     const updatedData = { ...this.data, [field]: value };
//     this.dataChange.emit(updatedData);
    
//     // Summary chỉ có 1 instance, dùng 'summary' làm instanceId
//     this.cvSectionsDataService.updateSectionData('summary', 'summary', updatedData);
//   }
// }

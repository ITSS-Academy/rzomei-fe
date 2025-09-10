import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sectionOrder',
  standalone: true
})
export class SectionOrderPipe implements PipeTransform {
  // Định nghĩa thứ tự mong muốn của sections
  private sectionOrder = [
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
    'customSections'
  ];

  transform(keyValuePairs: any[]): any[] {
    if (!keyValuePairs) return [];
    
    // Sort theo thứ tự đã định nghĩa
    return keyValuePairs.sort((a, b) => {
      const indexA = this.sectionOrder.indexOf(a.key);
      const indexB = this.sectionOrder.indexOf(b.key);
      
      // Nếu key không có trong order, đặt xuống cuối
      const orderA = indexA === -1 ? 999 : indexA;
      const orderB = indexB === -1 ? 999 : indexB;
      
      return orderA - orderB;
    });
  }
}

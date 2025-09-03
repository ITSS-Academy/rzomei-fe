import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CVSection {
  id: string;
  icon: string;
  title: string;
  desc: string;
  type: string;
  isActive: boolean; // Đã được thêm vào CV
  expanded?: boolean;
  order?: number;
  instanceId?: string; // ID duy nhất cho từng instance
  canDuplicate?: boolean; // Có thể tạo nhiều instances
  data?: any; // Dữ liệu của section
}

@Injectable({
  providedIn: 'root'
})
export class CvSectionsService {
  // Template các section có thể có
  

  // private sectionsSubject = new BehaviorSubject<CVSection[]>(
  //   this.sectionTemplates.map(section => ({ 
  //     ...section,
  //     instanceId: section.isActive ? `${section.id}_1` : undefined
  //   }))
  // );    

  // Observable cho tất cả sections
  // sections$ = this.sectionsSubject.asObservable();

  constructor() {}

  // // Lấy tất cả sections
  // getAllSections(): CVSection[] {
  //   return this.sectionsSubject.value;
  // }

  // // Lấy các sections đang active (đã thêm vào CV)
  // getActiveSections(): CVSection[] {
  //   return this.sectionsSubject.value
  //     .filter(section => section.isActive)
  //     .sort((a, b) => (a.order || 0) - (b.order || 0));
  // }

  // // Lấy các sections luôn hiển thị trong side-tool
  // getAvailableSections(): CVSection[] {
  //   // Trả về tất cả templates để luôn có thể add
  //   return this.sectionTemplates.map(template => ({
  //     ...template,
  //     isActive: false // Template luôn ở trạng thái chưa active
  //   }));
  // }

  // // Thêm section vào CV (tạo instance mới)
  // addSection(sectionId: string): void {
  //   const template = this.sectionTemplates.find(t => t.id === sectionId);
  //   if (!template) return;

  //   const sections = this.sectionsSubject.value;
  //   const existingSections = sections.filter(s => s.type === template.type && s.isActive);
  //   const nextInstanceNumber = existingSections.length + 1;
  //   const instanceId = `${template.id}_${Date.now()}_${nextInstanceNumber}`; // Sử dụng timestamp để đảm bảo unique
    
  //   const newSection: CVSection = {
  //     ...template,
  //     instanceId,
  //     title: template.title, // Giữ nguyên tên, không thêm số
  //     isActive: true,
  //     expanded: false,
  //     order: (template.order || 0) + (existingSections.length * 0.1) // Thứ tự phụ
  //   };
    
  //   sections.push(newSection);
  //   this.sectionsSubject.next([...sections]);
  // }

  // // Xóa section khỏi CV
  // removeSection(instanceId: string): void {
  //   const sections = this.sectionsSubject.value;
    
  //   // Xóa section khỏi danh sách (có thể xóa mọi section)
  //   const updatedSections = sections.filter(s => s.instanceId !== instanceId);
    
  //   this.sectionsSubject.next(updatedSections);
  // }

  // // Toggle trạng thái expanded của section
  // toggleSection(instanceId: string): void {
  //   const sections = this.sectionsSubject.value;
  //   const sectionIndex = sections.findIndex(s => s.instanceId === instanceId);
    
  //   if (sectionIndex !== -1 && sections[sectionIndex].isActive) {
  //     sections[sectionIndex] = {
  //       ...sections[sectionIndex],
  //       expanded: !sections[sectionIndex].expanded
  //     };
      
  //     this.sectionsSubject.next([...sections]);
  //   }
  // }

  // // Sắp xếp lại thứ tự sections
  // reorderSections(sectionIds: string[]): void {
  //   const sections = this.sectionsSubject.value;
    
  //   sectionIds.forEach((id, index) => {
  //     const sectionIndex = sections.findIndex(s => s.id === id);
  //     if (sectionIndex !== -1) {
  //       sections[sectionIndex] = {
  //         ...sections[sectionIndex],
  //         order: index + 1
  //       };
  //     }
  //   });
    
  //   this.sectionsSubject.next([...sections]);
  // }

  // // Lấy section theo instanceId
  // getSectionByInstanceId(instanceId: string): CVSection | undefined {
  //   return this.sectionsSubject.value.find(s => s.instanceId === instanceId);
  // }

  // // Lấy template section theo ID
  // getTemplateById(sectionId: string): CVSection | undefined {
  //   return this.sectionTemplates.find(t => t.id === sectionId);
  // }

  // // Set data cho section theo instanceId
  // setSectionData(instanceId: string, data: any): void {
  //   const sections = this.sectionsSubject.value;
  //   const sectionIndex = sections.findIndex(s => s.instanceId === instanceId);
    
  //   if (sectionIndex !== -1) {
  //     sections[sectionIndex] = {
  //       ...sections[sectionIndex],
  //       data: data
  //     };
      
  //     this.sectionsSubject.next([...sections]);
  //   }
  // }

  // // Update data cho section theo type (cho trường hợp không có instanceId)
  // updateSectionDataByType(type: string, data: any): void {
  //   const sections = this.sectionsSubject.value;
  //   const sectionIndex = sections.findIndex(s => s.type === type && s.isActive);
    
  //   if (sectionIndex !== -1) {
  //     sections[sectionIndex] = {
  //       ...sections[sectionIndex],
  //       data: data
  //     };
      
  //     this.sectionsSubject.next([...sections]);
  //   }
  // }
}

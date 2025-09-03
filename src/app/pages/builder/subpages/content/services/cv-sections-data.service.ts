import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CvSectionsDataService {
  private apiURL = 'http://localhost:3000/cv';

  // Lưu trữ data của các sections với instanceId unique
  private sectionDataSubject = new BehaviorSubject<{
    [instanceId: string]: any;
  }>({});
  sectionData$ = this.sectionDataSubject.asObservable();

  // constructor(private http: HttpClient) {
  // }

  constructor(private http: HttpClient) {}

  // Lấy data của một section theo instanceId
  getSectionData(instanceId: string): any {
    const allData = this.sectionDataSubject.value;
    return allData[instanceId] || {};
  }

  // Cập nhật data của một section với instanceId unique
  updateSectionData(instanceId: string, sectionType: string, data: any): void {
    const allData = { ...this.sectionDataSubject.value };
    allData[instanceId] = { ...data, _sectionType: sectionType }; // Lưu kèm loại section
    this.sectionDataSubject.next(allData);

    // Auto log mỗi khi có thay đổi
    this.autoLogCVData();
  }

  // Xóa data của một section
  removeSectionData(instanceId: string): void {
    const allData = { ...this.sectionDataSubject.value };
    delete allData[instanceId];
    this.sectionDataSubject.next(allData);

    console.log(`🗑️ Removed data for section ${instanceId}`);
  }

  // Clear tất cả data
  clearAllData(): void {
    this.sectionDataSubject.next({});
    console.log('🧹 Cleared all section data');
  }

  // Lấy tất cả sections theo loại
  getSectionsByType(sectionType: string): any[] {
    const allData = this.sectionDataSubject.value;
    const sections: any[] = [];

    Object.keys(allData).forEach((instanceId) => {
      if (allData[instanceId]._sectionType === sectionType) {
        const data = { ...allData[instanceId] };
        delete data._sectionType; // Xóa meta field
        sections.push(data);
      }
    });

    return sections;
  }

  // Log CV data theo format JSON mẫu
  logCVData(): void {
    const cvData = this.getFullCVData();
    // console.log('📋 Current CV Data (JSON Format):', JSON.stringify(cvData, null, 2));
  }

  // Method mới để tự động log mỗi khi có thay đổi
  private autoLogCVData(): void {
    this.logCVData();
  }

  // Method để lấy full CV data theo format chuẩn - FIXED để hỗ trợ multiple sections
  getFullCVData() {
    return {
      personalInfo: this.getSectionsByType('personal')[0] || {}, // Personal chỉ có 1
      summary: this.getSectionsByType('summary')[0] || '', // Summary chỉ có 1
      experience: this.getSectionsByType('experience'), // Array - hỗ trợ multiple
      education: this.getSectionsByType('education'), // Array - hỗ trợ multiple
      skills: this.getSectionsByType('skills'), // Array - hỗ trợ multiple
      projects: this.getSectionsByType('projects'), // Array - hỗ trợ multiple
      awards: this.getSectionsByType('certificates'), // Array - hỗ trợ multiple
      languages: this.getSectionsByType('languages'), // Array - hỗ trợ multiple
    };
  }

  renderCVToHTML(templateId: string = 'default'): Observable<any> {
    const cvData = this.getFullCVData();
    console.log(
      '📤 Sending CV data to render API:',
      JSON.stringify(cvData, null, 2)
    );

    return this.http.post(`${this.apiURL}/gen-theme`, {
      templateId,
      cvData,
      theme: null,
    });

  }

  // Export CV data theo format mẫu
  exportStandardCVJson(sections: any[]) {
    const cvData = this.getFullCVData();
    console.log('📋 Export Standard CV JSON:', JSON.stringify(cvData, null, 2));
    return cvData;
  }

  // Download JSON file
  downloadJsonFile(data: any, filename: string = 'cv-data.json') {
    console.log('📥 Would download:', filename, data);

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Thu thập tất cả CV data để xử lý
  collectAllCVData(sections: any[]): {
    success: boolean;
    message: string;
    data?: any;
  } {
    try {
      const cvData = this.getFullCVData();
      return {
        success: true,
        message: 'CV data collected successfully',
        data: cvData,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error collecting CV data: ${error}`,
      };
    }
  }

  // Method để xuất và download CV data
  exportAndDownloadCV() {
    const cvData = this.getFullCVData();
    console.log('🎯 Final CV Data Export:', JSON.stringify(cvData, null, 2));
    this.downloadJsonFile(cvData, 'my-cv-data.json');
    return cvData;
  }

  // Toggle auto logging
  toggleAutoLog(enabled: boolean): void {
    console.log(`🎛️ Auto logging ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Manual log trigger
  manualLogCVData(): void {
    const cvData = this.getFullCVData();
    console.log('🎯 Manual CV Data Log:', JSON.stringify(cvData, null, 2));
    console.log('📊 Section counts:', {
      personalInfo: Object.keys(cvData.personalInfo).length > 0 ? 1 : 0,
      summary: cvData.summary ? 1 : 0,
      experience: cvData.experience.length,
      education: cvData.education.length,
      skills: cvData.skills.length,
      projects: cvData.projects.length,
      awards: cvData.awards.length,
      languages: cvData.languages.length,
    });
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CVSection } from '../../services/cv-sections.service';

@Component({
  selector: 'app-certificates-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  template: `
    <div class="certificates-section">
      <h4>Chứng chỉ</h4>
      
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Tên chứng chỉ *</mat-label>
          <input matInput [value]="data?.name || ''" (input)="updateData('name', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tổ chức cấp</mat-label>
          <input matInput [value]="data?.organization || ''" (input)="updateData('organization', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Ngày cấp</mat-label>
          <input matInput [matDatepicker]="issuedPicker" [value]="data?.issuedDate || ''" (dateInput)="updateData('issuedDate', $event)">
          <mat-datepicker-toggle matIconSuffix [for]="issuedPicker"></mat-datepicker-toggle>
          <mat-datepicker #issuedPicker></mat-datepicker>
        </mat-form-field>

        <div class="expiry-checkbox-group">
          <mat-form-field appearance="outline" [class.disabled]="data?.noExpiry">
            <mat-label>Ngày hết hạn</mat-label>
            <input matInput [matDatepicker]="expiryPicker" [value]="data?.expiryDate || ''" 
                   [disabled]="data?.noExpiry" (dateInput)="updateData('expiryDate', $event)">
            <mat-datepicker-toggle matIconSuffix [for]="expiryPicker"></mat-datepicker-toggle>
            <mat-datepicker #expiryPicker></mat-datepicker>
          </mat-form-field>
          <mat-checkbox [checked]="data?.noExpiry || false" (change)="updateData('noExpiry', $event.checked)">
            Không có hạn sử dụng
          </mat-checkbox>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Mã chứng chỉ (tùy chọn)</mat-label>
          <input matInput [value]="data?.credentialId || ''" (input)="updateData('credentialId', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>URL xác thực (tùy chọn)</mat-label>
          <input matInput [value]="data?.credentialUrl || ''" placeholder="https://..." (input)="updateData('credentialUrl', $event)" />
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Mô tả (tùy chọn)</mat-label>
        <textarea
          matInput
          rows="3"
          [value]="data?.description || ''"
          (input)="updateData('description', $event)"
          placeholder="Kỹ năng đạt được, phạm vi ứng dụng..."
        ></textarea>
      </mat-form-field>
    </div>
  `,
  styleUrls: ['./section-forms.scss']
})
export class CertificatesFormComponent {
  @Input() section!: CVSection;
  @Input() data: any = {};
  @Output() dataChange = new EventEmitter<any>();

  updateData(field: string, event: Event | any): void {
    let value: any;
    if (typeof event === 'boolean') {
      value = event;
    } else if (event.target) {
      value = (event.target as HTMLInputElement).value;
    } else {
      value = event.value || event;
    }
    
    const updatedData = { ...this.data, [field]: value };
    
    // Nếu không có hạn, xóa ngày hết hạn
    if (field === 'noExpiry' && value) {
      updatedData.expiryDate = null;
    }
    
    this.dataChange.emit(updatedData);
  }
}

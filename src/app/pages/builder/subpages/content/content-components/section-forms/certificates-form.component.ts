import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Certification } from '../../../../../../models/cv-block.model';

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
    <div class="awards-section">
      <h4>Giải thưởng/Chứng chỉ</h4>
      
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Tên giải thưởng/chứng chỉ *</mat-label>
          <input matInput [value]="data?.title || ''" (input)="updateData('title', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tổ chức cấp</mat-label>
          <input matInput [value]="data?.issuer || ''" (input)="updateData('issuer', $event)" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Ngày nhận</mat-label>
          <input matInput [matDatepicker]="receivedPicker" [value]="data?.dateReceived || ''" (dateInput)="updateData('dateReceived', $event)">
          <mat-datepicker-toggle matIconSuffix [for]="receivedPicker"></mat-datepicker-toggle>
          <mat-datepicker #receivedPicker></mat-datepicker>
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
          <mat-label>URL xác thực (tùy chọn)</mat-label>
          <input matInput [value]="data?.verificationUrl || ''" placeholder="https://..." (input)="updateData('verificationUrl', $event)" />
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
  @Input() section!: Certification;
  @Input() data: any = {};
  @Output() dataChange = new EventEmitter<any>();

  constructor() {}

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

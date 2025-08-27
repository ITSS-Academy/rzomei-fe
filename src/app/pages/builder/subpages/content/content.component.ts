import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  imports: [CommonModule, MaterialModule, FormsModule],
})
export class ContentComponent {
  isEditing = false;

  // CV details
  cvDetails = {
    fullName: '',
    professionalTitle: '',
    email: 'Email',
    phone: 'Phone',
    location: 'Location',
  };

  // Temporary form data
  formData = { ...this.cvDetails };

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  updateCV(): void {
    this.cvDetails = { ...this.formData };
    this.toggleEdit();
  }
}

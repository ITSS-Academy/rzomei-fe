import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/material/material.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  user = {
    name: 'Văn Hữu Gia Cường',
    // email: 'cuongdeptrai@gmail.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  };

  changeLanguage() {
    console.log('Language changed');
  }

  onLogoutClick() {
    console.log('Logout clicked');
    // Implement logout logic
  }
}

import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CvSectionsDataService } from './subpages/content/services/cv-sections-data.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../../shared/material/material.module';

@Component({
  selector: 'app-builder',
  imports: [NavbarComponent, RouterModule, MaterialModule],
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
})
export class BuilderComponent {

}

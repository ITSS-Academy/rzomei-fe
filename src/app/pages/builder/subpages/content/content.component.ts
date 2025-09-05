import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material/material.module';
import { SideToolContentComponent } from './content-components/side-tool-content/side-tool-content.component';
import { SideItemContentComponent } from './content-components/side-item-content/side-item-content.component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  imports: [
    CommonModule,
    MaterialModule,
    SideItemContentComponent,
  ],
})
export class ContentComponent {

}
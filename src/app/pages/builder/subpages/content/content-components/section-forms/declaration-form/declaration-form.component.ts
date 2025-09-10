import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../../../../shared/material/material.module';
import { Observable, Subscription } from 'rxjs';
import { Declaration } from '../../../../../../../models/cv-block.model';
import { CvSectionState } from '../../../../../../../ngrx/cv-section/cv-section.state';
import { Store } from '@ngrx/store';
import {
  updateCvById,
  updateCvSection,
} from '../../../../../../../ngrx/cv-section/cv-section.actions';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  NgxEditorComponent,
  NgxEditorMenuComponent,
  Editor,
  Toolbar,
} from 'ngx-editor';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-declaration-form',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    NgxEditorComponent,
    NgxEditorMenuComponent,
  ],
  templateUrl: './declaration-form.component.html',
  styleUrl: './declaration-form.component.scss',
})
export class DeclarationFormComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  cvSections$!: Observable<Declaration | null>;
  declarationData: Declaration | null = null;
  id = 0;

  // Rich Text Editor
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h4', 'h5'] }],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  // Form Controls cho Declaration
  statementFormControl = new FormControl('');
  placeFormControl = new FormControl('');
  dateFormControl = new FormControl('');
  signatureFormControl = new FormControl('');
  idFormControl = new FormControl('');

  formGroup = new FormGroup({
    statement: this.statementFormControl,
    place: this.placeFormControl,
    date: this.dateFormControl,
    signature: this.signatureFormControl,
    id: this.idFormControl,
  });

  constructor(
    private store: Store<{ cvSections: CvSectionState }>,
    private activatedRoute: ActivatedRoute
  ) {
    this.cvSections$ = this.store.select(
      (state) => state.cvSections.sections!.declaration
    );
    this.id = this.activatedRoute.parent?.snapshot.params['id'];
  }

  ngOnInit(): void {
    // Initialize the editor
    this.editor = new Editor();

    this.subscription.add(
      this.cvSections$.subscribe((declarationData) => {
        this.declarationData = declarationData;
        if (declarationData) {
          this.formGroup.patchValue({
            statement: declarationData.statement || '',
            place: declarationData.place || '',
            date: declarationData.date || '',
            signature: declarationData.signature || '',
            id: declarationData.id || '',
          });
          this.store.dispatch(
            updateCvById({
              id: this.id,
              data: { declaration: this.declarationData },
            })
          );
        }
      })
    );
  }

  saveForm(): void {
    const declarationInfo: Declaration = {
      ...this.formGroup.value,
    } as Declaration;

    this.store.dispatch(
      updateCvSection({
        sectionType: 'declaration',
        data: declarationInfo,
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    // this.editor.destroy();
  }
}

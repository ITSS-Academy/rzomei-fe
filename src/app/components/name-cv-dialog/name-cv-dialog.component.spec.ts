import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameCvDialogComponent } from './name-cv-dialog.component';

describe('NameCvDialogComponent', () => {
  let component: NameCvDialogComponent;
  let fixture: ComponentFixture<NameCvDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NameCvDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NameCvDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

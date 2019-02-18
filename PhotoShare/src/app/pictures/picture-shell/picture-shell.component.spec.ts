import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureShellComponent } from './picture-shell.component';

describe('PictureShellComponent', () => {
  let component: PictureShellComponent;
  let fixture: ComponentFixture<PictureShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureListItemComponent } from './picture-list-item.component';

describe('PictureListItemComponent', () => {
  let component: PictureListItemComponent;
  let fixture: ComponentFixture<PictureListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

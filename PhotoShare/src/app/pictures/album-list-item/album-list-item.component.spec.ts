import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumListItemComponent } from './album-list-item.component';

describe('AlbumListItemComponent', () => {
  let component: AlbumListItemComponent;
  let fixture: ComponentFixture<AlbumListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

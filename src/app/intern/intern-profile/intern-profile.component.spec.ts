import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternProfileComponent } from './intern-profile.component';

describe('InternProfileComponent', () => {
  let component: InternProfileComponent;
  let fixture: ComponentFixture<InternProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

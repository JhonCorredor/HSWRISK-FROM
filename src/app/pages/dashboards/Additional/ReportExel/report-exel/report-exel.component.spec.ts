import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportExelComponent } from './report-exel.component';

describe('ReportExelComponent', () => {
  let component: ReportExelComponent;
  let fixture: ComponentFixture<ReportExelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportExelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportExelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

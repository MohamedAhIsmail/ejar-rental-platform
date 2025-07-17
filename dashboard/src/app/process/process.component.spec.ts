import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProcessComponent } from './process.component';

describe('AllProcessComponent', () => {
  let component: AllProcessComponent;
  let fixture: ComponentFixture<AllProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllProcessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUsersComponent } from './new-users.component';

describe('NewUsersComponent', () => {
  let component: NewUsersComponent;
  let fixture: ComponentFixture<NewUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

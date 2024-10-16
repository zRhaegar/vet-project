import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetCardPage } from './pet-card.page';

describe('PetCardPage', () => {
  let component: PetCardPage;
  let fixture: ComponentFixture<PetCardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PetCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

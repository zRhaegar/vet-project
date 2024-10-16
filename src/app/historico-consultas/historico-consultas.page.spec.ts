import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoricoConsultasPage } from './historico-consultas.page';

describe('HistoricoConsultasPage', () => {
  let component: HistoricoConsultasPage;
  let fixture: ComponentFixture<HistoricoConsultasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoConsultasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

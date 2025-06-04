import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneprenotazioniComponent } from './gestioneprenotazioni.component';

describe('GestioneprenotazioniComponent', () => {
  let component: GestioneprenotazioniComponent;
  let fixture: ComponentFixture<GestioneprenotazioniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestioneprenotazioniComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestioneprenotazioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneOperatoriComponent } from './gestione-operatori.component';

describe('GestioneOperatoriComponent', () => {
  let component: GestioneOperatoriComponent;
  let fixture: ComponentFixture<GestioneOperatoriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestioneOperatoriComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestioneOperatoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

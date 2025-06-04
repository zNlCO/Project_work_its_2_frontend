import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionebicicletteComponent } from './gestionebiciclette.component';

describe('GestionebicicletteComponent', () => {
  let component: GestionebicicletteComponent;
  let fixture: ComponentFixture<GestionebicicletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionebicicletteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionebicicletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

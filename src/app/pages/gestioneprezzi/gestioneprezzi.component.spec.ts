import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioneprezziComponent } from './gestioneprezzi.component';

describe('GestioneprezziComponent', () => {
  let component: GestioneprezziComponent;
  let fixture: ComponentFixture<GestioneprezziComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestioneprezziComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestioneprezziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

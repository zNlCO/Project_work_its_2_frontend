import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntivenditaComponent } from './puntivendita.component';

describe('PuntivenditaComponent', () => {
  let component: PuntivenditaComponent;
  let fixture: ComponentFixture<PuntivenditaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PuntivenditaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PuntivenditaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

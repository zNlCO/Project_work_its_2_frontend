import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaManutenzioniComponent } from './pagina-manutenzioni.component';

describe('PaginaManutenzioniComponent', () => {
  let component: PaginaManutenzioniComponent;
  let fixture: ComponentFixture<PaginaManutenzioniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginaManutenzioniComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaginaManutenzioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

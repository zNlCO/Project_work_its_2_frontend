import { Component, OnInit } from '@angular/core';

// L'interfaccia ora non ha più la proprietà "stato"
export interface Operatore {
  id: number;
  nomeCompleto: string;
  email: string;
  ruolo: 'Operatore';
  dataCreazione: string;
}

@Component({
  selector: 'app-gestione-operatori',
  templateUrl: './gestione-operatori.component.html',
  styleUrls: ['./gestione-operatori.component.scss']
})
export class GestioneOperatoriComponent implements OnInit {

  operatori: Operatore[] = [];
  operatoriFiltrati: Operatore[] = [];
  searchTerm: string = '';

  isAddModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  isDeleteModalOpen: boolean = false;

  operatoreDaModificare?: Operatore;
  operatoreDaEliminare?: Operatore;
  
  // Rimosso "stato" dall'oggetto per il nuovo operatore
  nuovoOperatore: Partial<Operatore> = {
    nomeCompleto: '',
    email: '',
    ruolo: 'Operatore'
  };

  ngOnInit(): void {
    this.caricaDatiIniziali();
  }

  caricaDatiIniziali(): void {
    // Dati di esempio senza il campo "stato"
    this.operatori = [
      { id: 1, nomeCompleto: 'Mario Rossi', email: 'mario.rossi@bikerental.com', ruolo: 'Operatore', dataCreazione: '01/01/2025' },
      { id: 2, nomeCompleto: 'Anna Verdi', email: 'anna.verdi@bikerental.com', ruolo: 'Operatore', dataCreazione: '15/03/2025' },
      { id: 3, nomeCompleto: 'Luca Bianchi', email: 'luca.bianchi@bikerental.com', ruolo: 'Operatore', dataCreazione: '20/05/2025' },
    ];
    this.operatoriFiltrati = [...this.operatori];
  }

  filtraOperatori(): void {
    const termine = this.searchTerm.toLowerCase();
    if (!termine) {
      this.operatoriFiltrati = [...this.operatori];
      return;
    }
    this.operatoriFiltrati = this.operatori.filter(op =>
      op.nomeCompleto.toLowerCase().includes(termine) ||
      op.email.toLowerCase().includes(termine)
    );
  }

  apriModaleAggiungi(): void {
    // Reset del form senza "stato"
    this.nuovoOperatore = { nomeCompleto: '', email: '', ruolo: 'Operatore' };
    this.isAddModalOpen = true;
  }

  apriModaleModifica(operatore: Operatore): void {
    this.operatoreDaModificare = { ...operatore };
    this.isEditModalOpen = true;
  }

  apriModaleElimina(operatore: Operatore): void {
    this.operatoreDaEliminare = operatore;
    this.isDeleteModalOpen = true;
  }

  chiudiModali(): void {
    this.isAddModalOpen = false;
    this.isEditModalOpen = false;
    this.isDeleteModalOpen = false;
    this.operatoreDaModificare = undefined;
    this.operatoreDaEliminare = undefined;
  }

  aggiungiOperatore(): void {
    if (!this.nuovoOperatore.nomeCompleto || !this.nuovoOperatore.email) {
      alert('Nome completo e Email sono obbligatori.');
      return;
    }
    
    // Creazione del nuovo oggetto senza "stato"
    const nuovo: Operatore = {
      id: new Date().getTime(),
      nomeCompleto: this.nuovoOperatore.nomeCompleto,
      email: this.nuovoOperatore.email,
      ruolo: 'Operatore',
      dataCreazione: new Date().toLocaleDateString('it-IT')
    };

    this.operatori.push(nuovo);
    this.filtraOperatori();
    this.chiudiModali();
  }

  salvaModificheOperatore(): void {
    if (!this.operatoreDaModificare) return;
    const index = this.operatori.findIndex(op => op.id === this.operatoreDaModificare!.id);
    if (index !== -1) {
      this.operatori[index] = this.operatoreDaModificare;
    }
    this.filtraOperatori();
    this.chiudiModali();
  }

  confermaEliminazione(): void {
    if (!this.operatoreDaEliminare) return;
    this.operatori = this.operatori.filter(op => op.id !== this.operatoreDaEliminare!.id);
    this.filtraOperatori();
    this.chiudiModali();
  }
  
  trackById(index: number, operatore: Operatore): number {
    return operatore.id;
  }
}
import { Component, OnInit } from '@angular/core';

// Interfaccia unificata per Utente e Operatore
export interface Utente {
  id: number;
  nomeCompleto: string;
  email: string;
  ruolo: 'Operatore' | 'Utente'; // Ruolo può essere uno dei due valori
  dataCreazione: string;
  password?: string; // La password è opzionale e usata solo per la creazione
}

@Component({
  selector: 'app-gestione-operatori',
  templateUrl: './gestione-operatori.component.html',
  styleUrls: ['./gestione-operatori.component.scss']
})
export class GestioneOperatoriComponent implements OnInit {

  utenti: Utente[] = [];
  utentiFiltrati: Utente[] = [];
  searchTerm: string = '';

  isAddModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  isDeleteModalOpen: boolean = false;

  utenteDaModificare?: Utente;
  utenteDaEliminare?: Utente;
  
  // Oggetto per il nuovo utente, include la password
  nuovoUtente: Partial<Utente> = {
    nomeCompleto: '',
    email: '',
    password: '',
    ruolo: 'Operatore'
  };

  ngOnInit(): void {
    this.caricaDatiIniziali();
  }

  caricaDatiIniziali(): void {
    // Dati di esempio con il campo ruolo flessibile
    this.utenti = [
      { id: 1, nomeCompleto: 'Mario Rossi', email: 'mario.rossi@bikerental.com', ruolo: 'Operatore', dataCreazione: '01/01/2025' },
      { id: 2, nomeCompleto: 'Anna Verdi', email: 'anna.verdi@bikerental.com', ruolo: 'Operatore', dataCreazione: '15/03/2025' },
      { id: 3, nomeCompleto: 'Luca Bianchi', email: 'luca.bianchi@bikerental.com', ruolo: 'Operatore', dataCreazione: '20/05/2025' },
    ];
    // Inizialmente mostra solo gli operatori
    this.filtraUtenti();
  }

  filtraUtenti(): void {
    // Mostra solo gli operatori nella tabella principale
    const operatori = this.utenti.filter(u => u.ruolo === 'Operatore');
    const termine = this.searchTerm.toLowerCase();
    
    if (!termine) {
      this.utentiFiltrati = [...operatori];
      return;
    }

    this.utentiFiltrati = operatori.filter(op =>
      op.nomeCompleto.toLowerCase().includes(termine) ||
      op.email.toLowerCase().includes(termine)
    );
  }

  apriModaleAggiungi(): void {
    this.nuovoUtente = { nomeCompleto: '', email: '', password: '', ruolo: 'Operatore' };
    this.isAddModalOpen = true;
  }

  apriModaleModifica(utente: Utente): void {
    this.utenteDaModificare = { ...utente };
    this.isEditModalOpen = true;
  }

  apriModaleElimina(utente: Utente): void {
    this.utenteDaEliminare = utente;
    this.isDeleteModalOpen = true;
  }

  chiudiModali(): void {
    this.isAddModalOpen = false;
    this.isEditModalOpen = false;
    this.isDeleteModalOpen = false;
    this.utenteDaModificare = undefined;
    this.utenteDaEliminare = undefined;
  }

  aggiungiOperatore(): void {
    if (!this.nuovoUtente.nomeCompleto || !this.nuovoUtente.email || !this.nuovoUtente.password) {
      // Sostituire alert con un sistema di notifiche più elegante in un'app reale
      alert('Tutti i campi sono obbligatori.');
      return;
    }
    
    const nuovo: Utente = {
      id: new Date().getTime(),
      nomeCompleto: this.nuovoUtente.nomeCompleto,
      email: this.nuovoUtente.email,
      ruolo: 'Operatore', // I nuovi utenti sono sempre Operatori
      dataCreazione: new Date().toLocaleDateString('it-IT')
      // La password non viene salvata nell'oggetto in memoria per sicurezza
    };

    this.utenti.push(nuovo);
    this.filtraUtenti();
    this.chiudiModali();
  }

  salvaModificheUtente(): void {
    if (!this.utenteDaModificare) return;

    const index = this.utenti.findIndex(op => op.id === this.utenteDaModificare!.id);

    if (index !== -1) {
       // Se il ruolo viene cambiato a 'Utente', l'oggetto viene aggiornato
       // ma non sarà più visibile nella lista principale grazie a filtraUtenti().
      this.utenti[index] = this.utenteDaModificare;
    }
    
    this.filtraUtenti(); // Riapplica i filtri per aggiornare la vista
    this.chiudiModali();
  }

  confermaEliminazione(): void {
    if (!this.utenteDaEliminare) return;
    this.utenti = this.utenti.filter(op => op.id !== this.utenteDaEliminare!.id);
    this.filtraUtenti();
    this.chiudiModali();
  }
  
  trackById(index: number, utente: Utente): number {
    return utente.id;
  }
}

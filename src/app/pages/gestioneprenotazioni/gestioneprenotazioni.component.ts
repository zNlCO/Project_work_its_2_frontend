import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Interfacce per tipizzare i dati
interface Prenotazione {
  id: string;
  utente: {
    nome: string;
    cognome: string;
    email: string;
  };
  periodo: {
    dataInizio: Date;
    dataFine: Date;
    oraInizio: string;
    oraFine: string;
  };
  puntoRitiro: string;
  puntoRiconsegna: string;
  bicicletta: {
    tipo: string;
    taglia: string;
    accessori?: string[];
  };
  statoRitiro: 'da_ritirare' | 'ritirata';
  statoRiconsegna: 'da_riconsegnare' | 'riconsegnata' | 'riconsegnata_con_problemi';
  problemiSegnalati?: string[];
}

interface FiltriPrenotazioni {
  utente?: string;
  puntoRitiro?: string;
  dataRitiro?: string;
  conProblemi?: boolean;
}

@Component({
  selector: 'app-gestioneprenotazioni',
  templateUrl: './gestioneprenotazioni.component.html',
  styleUrls: ['./gestioneprenotazioni.component.scss']
})
export class GestioneprenotazioniComponent implements OnInit {
  
  // Dati delle prenotazioni
  prenotazioni: Prenotazione[] = [];
  prenotazioniFiltrate: Prenotazione[] = [];
  
  // Filtri
  filtri: FiltriPrenotazioni = {};
  
  // Stati di caricamento e errore
  loading = false;
  error: string | null = null;
  
  // Opzioni per i filtri
  puntiRitiro = [
    { value: 'all', label: 'Tutti i Punti' },
    { value: 'stazione', label: 'Stazione Centrale' },
    { value: 'rialto', label: 'Bike Point Rialto' },
    { value: 'lido', label: 'Deposito Lido' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.caricaPrenotazioni();
  }

  caricaPrenotazioni(): void {
    this.loading = true;
    this.error = null;
    
    // --- CORREZIONE QUI ---
    // Dichiariamo esplicitamente che questo array è di tipo Prenotazione[]
    const datiMock: Prenotazione[] = [
      {
        id: 'BK00123',
        utente: { nome: 'Mario', cognome: 'Rossi', email: 'mario.rossi@email.com' },
        periodo: { dataInizio: new Date('2025-06-10T10:00:00'), dataFine: new Date('2025-06-10T18:00:00'), oraInizio: '10:00', oraFine: '18:00' },
        puntoRitiro: 'Stazione Centrale', puntoRiconsegna: 'Stazione Centrale',
        bicicletta: { tipo: 'City Bike', taglia: 'M' },
        statoRitiro: 'da_ritirare',
        statoRiconsegna: 'da_riconsegnare'
      },
      {
        id: 'BK00124',
        utente: { nome: 'Anna', cognome: 'Verdi', email: 'anna.verdi@email.com' },
        periodo: { dataInizio: new Date('2025-06-10T14:00:00'), dataFine: new Date('2025-06-11T14:00:00'), oraInizio: '14:00', oraFine: '14:00' },
        puntoRitiro: 'Bike Point Rialto', puntoRiconsegna: 'Deposito Lido',
        bicicletta: { tipo: 'E-MTB', taglia: 'L', accessori: ['Casco'] },
        statoRitiro: 'ritirata',
        statoRiconsegna: 'da_riconsegnare'
      },
      {
        id: 'BK00121',
        utente: { nome: 'Paolo', cognome: 'Gialli', email: 'paolo.gialli@email.com' },
        periodo: { dataInizio: new Date('2025-06-09T11:00:00'), dataFine: new Date('2025-06-09T16:00:00'), oraInizio: '11:00', oraFine: '16:00' },
        puntoRitiro: 'Stazione Centrale', puntoRiconsegna: 'Stazione Centrale',
        bicicletta: { tipo: 'Gravel', taglia: 'L' },
        statoRitiro: 'ritirata',
        statoRiconsegna: 'riconsegnata_con_problemi',
        problemiSegnalati: ['Graffio sul telaio', 'Riconsegna in ritardo di 30 min.']
      },
      {
        id: 'BK00120',
        utente: { nome: 'Luca', cognome: 'Bianchi', email: 'luca.bianchi@email.com' },
        periodo: { dataInizio: new Date('2025-06-08T09:00:00'), dataFine: new Date('2025-06-08T13:00:00'), oraInizio: '09:00', oraFine: '13:00' },
        puntoRitiro: 'Deposito Lido', puntoRiconsegna: 'Deposito Lido',
        bicicletta: { tipo: 'Road Bike', taglia: 'M' },
        statoRitiro: 'ritirata',
        statoRiconsegna: 'riconsegnata'
      }
    ];

    // Simula la chiamata API
    of(datiMock).pipe(delay(500)).subscribe({
      next: (data) => {
        this.prenotazioni = data;
        this.prenotazioniFiltrate = [...data];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento delle prenotazioni';
        this.loading = false;
        console.error('Errore API:', err);
      }
    });
  }

  // --- (Tutti gli altri metodi rimangono invariati) ---

  applicaFiltri(): void {
    let risultatoFiltrato = [...this.prenotazioni];

    if (this.filtri.utente) {
      const termineRicerca = this.filtri.utente.toLowerCase();
      risultatoFiltrato = risultatoFiltrato.filter(p =>
        `${p.utente.nome} ${p.utente.cognome}`.toLowerCase().includes(termineRicerca) ||
        p.utente.email.toLowerCase().includes(termineRicerca)
      );
    }
    
    if (this.filtri.puntoRitiro && this.filtri.puntoRitiro !== 'all') {
      const nomePuntoSelezionato = this.puntiRitiro.find(pr => pr.value === this.filtri.puntoRitiro)?.label;
      risultatoFiltrato = risultatoFiltrato.filter(p => p.puntoRitiro === nomePuntoSelezionato);
    }
    
    if (this.filtri.dataRitiro) {
      const dataFiltro = new Date(this.filtri.dataRitiro).toDateString();
      risultatoFiltrato = risultatoFiltrato.filter(p => new Date(p.periodo.dataInizio).toDateString() === dataFiltro);
    }
    
    if (this.filtri.conProblemi) {
      risultatoFiltrato = risultatoFiltrato.filter(p => p.statoRiconsegna === 'riconsegnata_con_problemi');
    }
    
    this.prenotazioniFiltrate = risultatoFiltrato;
  }

  onFiltroUtenteChange(event: Event): void {
    this.filtri.utente = (event.target as HTMLInputElement).value;
  }

  onFiltroPuntoRitiroChange(event: Event): void {
    this.filtri.puntoRitiro = (event.target as HTMLSelectElement).value;
  }

  onFiltroDataChange(event: Event): void {
    this.filtri.dataRitiro = (event.target as HTMLInputElement).value;
  }

  onFiltroProblemiChange(event: Event): void {
    this.filtri.conProblemi = (event.target as HTMLInputElement).checked;
  }

  formatPeriodo(prenotazione: Prenotazione): string {
    const formatOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const dataInizio = new Date(prenotazione.periodo.dataInizio).toLocaleDateString('it-IT', formatOptions);
    const dataFine = new Date(prenotazione.periodo.dataFine).toLocaleDateString('it-IT', formatOptions);
    
    if (dataInizio === dataFine) {
      return `${dataInizio} ${prenotazione.periodo.oraInizio} - ${prenotazione.periodo.oraFine}`;
    } else {
      return `${dataInizio} ${prenotazione.periodo.oraInizio} - ${dataFine} ${prenotazione.periodo.oraFine}`;
    }
  }

  formatBicicletta(prenotazione: Prenotazione): string {
    let risultato = `${prenotazione.bicicletta.tipo} (${prenotazione.bicicletta.taglia})`;
    if (prenotazione.bicicletta.accessori && prenotazione.bicicletta.accessori.length > 0) {
      risultato += ' + Accessori';
    }
    return risultato;
  }

  getStatoRitiroClass(stato: string): string {
    return stato === 'da_ritirare' ? 'status-pending' : 'status-completed';
  }

  getStatoRiconsegnaClass(stato: string): string {
    switch (stato) {
      case 'da_riconsegnare': return 'status-pending';
      case 'riconsegnata': return 'status-completed';
      case 'riconsegnata_con_problemi': return 'status-with-issues';
      default: return '';
    }
  }

  getStatoRitiroText(stato: string): string {
    return stato === 'da_ritirare' ? 'Da Ritirare' : 'Ritirata';
  }

  getStatoRiconsegnaText(stato: string): string {
    switch (stato) {
      case 'da_riconsegnare': return 'Da Riconsegnare';
      case 'riconsegnata': return 'Riconsegnata';
      case 'riconsegnata_con_problemi': return 'Con Problemi';
      default: return stato;
    }
  }

  onPrenotazioneClick(prenotazioneId: string): void {
    console.log('Visualizzazione dettagli per la prenotazione:', prenotazioneId);
  }

  trackByPrenotazioneId(index: number, prenotazione: Prenotazione): string {
    return prenotazione.id;
  }
}
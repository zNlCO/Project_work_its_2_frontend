import { Component, OnInit } from '@angular/core';
import { PrenotazioneService, PrenotazioneGualti } from '../../services/prenotazione.service'; // aggiorna con il path corretto
import { Store,StoreService } from '../../services/store.service';

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
  
  prenotazioni: PrenotazioneGualti[] = [];
  prenotazioniFiltrate: PrenotazioneGualti[] = [];
  stores: Store[] = []
  
  filtri: FiltriPrenotazioni = {};
  
  loading = false;
  error: string | null = null;
  
  constructor(private prenotazioneService: PrenotazioneService, private storeService: StoreService) {}

  ngOnInit(): void {
    this.caricaPrenotazioniDaAPI();
  }

  caricaPrenotazioniDaAPI(): void {
    this.loading = true;
    this.error = null;

    this.prenotazioneService.getPrenotazioniGualti().subscribe({
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

    this.storeService.getStores().subscribe({
      next: (data) => {
        this.stores = data;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento degli stores';
        this.loading = false;
        console.error('Errore API:', err);
      }
    })
  }

  applicaFiltri(): void {
    let risultatoFiltrato = [...this.prenotazioni];

    if (this.filtri.utente) {
      const termineRicerca = this.filtri.utente.toLowerCase();
      risultatoFiltrato = risultatoFiltrato.filter(p =>
        p.idUser.name.toLowerCase().includes(termineRicerca) ||
        p.idUser.email.toLowerCase().includes(termineRicerca)
      );
    }

    if (this.filtri.puntoRitiro && this.filtri.puntoRitiro !== 'all') {
      const nomePuntoSelezionato = this.stores.find(pr => pr.location === this.filtri.puntoRitiro)?.location;
      if (nomePuntoSelezionato) {
        risultatoFiltrato = risultatoFiltrato.filter(p => p.pickupLocation.location === nomePuntoSelezionato);
      }
    }

    if (this.filtri.dataRitiro) {
      const dataFiltro = new Date(this.filtri.dataRitiro).toDateString();
      risultatoFiltrato = risultatoFiltrato.filter(p => new Date(p.start).toDateString() === dataFiltro);
    }

    if (this.filtri.conProblemi) {
      risultatoFiltrato = risultatoFiltrato.filter(p => p.status.toLowerCase().includes('problemi'));
    }

    this.prenotazioniFiltrate = risultatoFiltrato;
  }

  onFiltroUtenteChange(event: Event): void {
    this.filtri.utente = (event.target as HTMLInputElement).value;
    this.applicaFiltri();
  }

  onFiltroPuntoRitiroChange(event: Event): void {
    this.filtri.puntoRitiro = (event.target as HTMLSelectElement).value;
    this.applicaFiltri();
  }

  onFiltroDataChange(event: Event): void {
    this.filtri.dataRitiro = (event.target as HTMLInputElement).value;
    this.applicaFiltri();
  }

  onFiltroProblemiChange(event: Event): void {
    this.filtri.conProblemi = (event.target as HTMLInputElement).checked;
    this.applicaFiltri();
  }

  formatPeriodo(prenotazione: PrenotazioneGualti): string {
    const start = new Date(prenotazione.start);
    const stop = new Date(prenotazione.stop);
    const formatOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

    const dataInizio = start.toLocaleDateString('it-IT', formatOptions);
    const dataFine = stop.toLocaleDateString('it-IT', formatOptions);

    const oraInizio = start.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const oraFine = stop.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

    if (dataInizio === dataFine) {
      return `${dataInizio} ${oraInizio} - ${oraFine}`;
    } else {
      return `${dataInizio} ${oraInizio} - ${dataFine} ${oraFine}`;
    }
  }

  formatBicicletta(prenotazione: PrenotazioneGualti): string {
    return prenotazione.bikes
      .map(b => {
        const modello = b.id.idModello;
        const descrizione = modello?.descrizione ?? 'N/D';
        const taglia = modello?.size ?? '';
        return `${descrizione} (${taglia})`;
      })
      .join('; ');
  }

  formatAccessori(prenotazione: PrenotazioneGualti): string {
    return prenotazione.bikes
      .map(b => {
        const accessori = b.accessori?.map(a => a.descrizione).join(', ');
        return accessori ? `${accessori}` : `N/A`;
      })
      .join('; ');
  }
  formatAssicurazione(prenotazione: PrenotazioneGualti): string {
    return prenotazione.bikes
      .map(b => {
        const assicurazione = b.assicurazione?.descrizione;
        return assicurazione ? `${assicurazione}` : `N/A`;
      })
      .join('; ');
  }

  onPrenotazioneClick(prenotazioneId: string): void {
    console.log('Visualizzazione dettagli per la prenotazione:', prenotazioneId);
  }

  trackByPrenotazioneId(index: number, prenotazione: PrenotazioneGualti): string {
    return prenotazione._id;
  }

  getStatoClass(status: string): string {
  switch (status) {
    case 'Prenotato':
      return 'status-warning';  // colore giallo/arancione
    case 'In corso':
      return 'status-info';     // colore blu
    case 'Completato':
      return 'status-success';  // colore verde
    case 'Con Problemi':
      return 'status-danger';   // colore rosso
    case 'Cancellato':
      return 'status-danger';
    default:
      return 'status-unknown';  // colore grigio/neutro
  }
}

getStatoIcon(status: string): string {
  switch (status) {
    case 'Prenotato':
      return 'fa-hourglass-start';  // clessidra inizio
    case 'In corso':
      return 'fa-truck-loading';    // icona simbolica ritiro (puoi cambiare)
    case 'Completato':
      return 'fa-check-circle';     // cerchio check verde
    case 'Con Problemi':
      return 'fa-exclamation-triangle'; // triangolo warning rosso
    case 'Cancellato':
      return 'fa-times'
    default:
      return 'fa-question-circle';  // punto interrogativo
  }
}

}

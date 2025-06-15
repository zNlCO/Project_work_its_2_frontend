import { Component, OnInit } from '@angular/core';
import { Store, StoreService } from '../../services/store.service';
import { Bike, BikeService } from '../../services/bike.service';
import { BikeModel } from '../../services/bike-model.service';
import { PrenotazioneService, PrenotazioneInput, PrenotazioneGualti } from '../../services/prenotazione.service';

// INTERFACCE DATI
export interface SingleBike {
  _id: string;
  modelName: string;
  propulsion: 'Muscolare' | 'Elettrica';
  status: 'Disponibile' | 'Noleggiata' | 'In Manutenzione';
  locationId: string;
  maintenanceEnd?: string;
  quantity: number;
}

@Component({
  selector: 'app-pagina-manutenzioni',
  templateUrl: './pagina-manutenzioni.component.html',
  styleUrls: ['./pagina-manutenzioni.component.scss', './pagina-manutenzioni.component2.scss', './pagina-manutenzioni.component3.scss', './pagina-manutenzioni.component4.scss']
})
export class PaginaManutenzioniComponent implements OnInit {
  // --- STATO DEL COMPONENTE ---
  locations: Store[] = [];
  allBikes: SingleBike[] = [];
  bikesForCurrentLocation: SingleBike[] = [];
  activeMaintenances: PrenotazioneGualti[] = [];
  
  selectedLocationId: string = '';
  selectedLocationName: string = '';
  currentYear = new Date().getFullYear();

  // --- STATO DEL MODALE UNICO ---
  isMaintenanceModalOpen = false;
  selectedBike: SingleBike | null = null;
  maintenanceType: 'schedule' | 'immediate' | null = null;
  
  // Dati per i date-picker
  startDate: string = '';
  endDate: string = '';
  today: string = new Date().toISOString().split('T')[0];

  // Error handling
  errorMessage: string = '';
  isProcessing: boolean = false;
  successMessage: string = '';

  constructor(
    private storeSrv: StoreService,
    private bikeSrv: BikeService,
    private prenotazioneSrv: PrenotazioneService
  ) {}

  ngOnInit(): void {
    this.loadStores();
    this.loadActiveMaintenances();
  }

  loadStores() {
    this.storeSrv.getStores().subscribe({
      next: (stores) => {
        this.locations = stores;
        if (stores.length > 0) {
          this.selectedLocationId = stores[0]._id!;
          this.selectedLocationName = stores[0].location;
          this.loadBikesForStore(this.selectedLocationId);
        }
      },
      error: (error) => {
        console.error('Error loading stores:', error);
        this.errorMessage = 'Errore nel caricamento dei punti vendita';
      }
    });
  }

  loadActiveMaintenances() {
    this.prenotazioneSrv.getPrenotazioniGualti().subscribe({
      next: (prenotazioni) => {
        this.activeMaintenances = prenotazioni.filter(p => 
          p.manutenzione && 
          !p.cancelled && 
          new Date(p.stop) > new Date()
        );
        // If we have bikes loaded, update their statuses
        if (this.allBikes.length > 0) {
          this.updateBikeStatuses();
        }
      },
      error: (error) => {
        console.error('Error loading maintenances:', error);
      }
    });
  }

  updateBikeStatuses() {
    this.allBikes = this.allBikes.map(bike => {
      const maintenance = this.activeMaintenances.find(m => 
        m.bikes.some(b => b.id._id === bike._id)
      );
      
      if (maintenance) {
        return {
          ...bike,
          status: 'In Manutenzione',
          maintenanceEnd: maintenance.stop
        };
      }
      return bike;
    });
    
    this.bikesForCurrentLocation = this.allBikes.filter(
      bike => bike.locationId === this.selectedLocationId
    );
  }

  loadBikesForStore(storeId: string) {
    this.bikeSrv.getAllBikes().subscribe({
      next: (bikes) => {
        this.allBikes = bikes.map(bike => ({
          _id: bike._id!,
          modelName: bike.idModello.descrizione,
          propulsion: bike.idModello.elettrica ? 'Elettrica' : 'Muscolare',
          status: 'Disponibile',
          locationId: bike.idPuntoVendita as string,
          quantity: bike.quantity
        }));
        // Aggiorniamo gli stati delle bici in base alle manutenzioni attive
        this.updateBikeStatuses();
      },
      error: (error) => {
        console.error('Error loading bikes:', error);
        this.errorMessage = 'Errore nel caricamento delle bici';
      }
    });
  }

  onLocationChange(): void {
    const selectedLocation = this.locations.find(loc => loc._id === this.selectedLocationId);
    if (selectedLocation) {
      this.selectedLocationName = selectedLocation.location;
      this.loadBikesForStore(this.selectedLocationId);
    }
  }

  // --- GESTIONE MODALE ---
  openMaintenanceModal(bike: SingleBike): void {
    this.selectedBike = bike;
    this.isMaintenanceModalOpen = true;
    this.errorMessage = '';
    // Resetta lo stato interno del modale
    this.maintenanceType = null;
    this.startDate = '';
    this.endDate = '';
  }

  closeMaintenanceModal(): void {
    this.isMaintenanceModalOpen = false;
    this.errorMessage = '';
    setTimeout(() => {
      this.selectedBike = null;
    }, 300);
  }

  selectMaintenanceType(type: 'schedule' | 'immediate'): void {
    this.maintenanceType = type;
  }

  confirmMaintenance(): void {
    if (!this.selectedBike || !this.canConfirmMaintenance()) return;

    this.isProcessing = true;
    this.errorMessage = '';

    const startDate = this.maintenanceType === 'immediate' ? new Date(this.today) : new Date(this.startDate);
    const endDate = new Date(this.endDate);

    const prenotazioneInput: PrenotazioneInput = {
      bikes: [{
        id: this.selectedBike._id,
        quantity: 1,
        accessori: [],
      }],
      start: startDate,
      stop: endDate,
      pickupLocation: this.selectedLocationId,
      dropLocation: this.selectedLocationId,
      manutenzione: true
    };

    this.prenotazioneSrv.addPrenotazione(prenotazioneInput).subscribe({
      next: (response) => {
        console.log('Maintenance booking created:', response);
        this.showSuccessMessage('Manutenzione programmata con successo!');
        this.loadActiveMaintenances(); // Ricarica le manutenzioni per coerenza futura
        this.closeMaintenanceModal();
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error creating maintenance booking:', error);
        this.errorMessage = 'Errore nella creazione della manutenzione';
        this.isProcessing = false;
      }
    });
  }

  // --- METODI UTILITY PER LA UI ---
  getCardClass(bike: SingleBike): string {
    return `status-${bike.status.toLowerCase().replace(' ', '-')}`;
  }

  getStatusInfo(bike: SingleBike): { icon: string, text: string, details: string } {
    switch (bike.status) {
      case 'Disponibile':
        return { icon: 'fa-check-circle', text: 'Disponibile', details: 'Pronta per il noleggio' };
      case 'Noleggiata':
        return { icon: 'fa-user-clock', text: 'Noleggiata', details: 'Attualmente in uso' };
      case 'In Manutenzione':
        const endDate = bike.maintenanceEnd ? new Date(bike.maintenanceEnd).toLocaleDateString('it-IT') : 'N/D';
        return { icon: 'fa-tools', text: 'In Manutenzione', details: `Fino al ${endDate}` };
      default:
        return { icon: 'fa-question-circle', text: 'Sconosciuto', details: '' };
    }
  }

  getMinEndDate(): string {
    if (this.maintenanceType === 'schedule' && this.startDate) {
      return this.startDate;
    }
    return this.today;
  }

  canConfirmMaintenance(): boolean {
    if (!this.maintenanceType) return false;
    if (this.maintenanceType === 'schedule') {
      return !!this.startDate && !!this.endDate && this.startDate <= this.endDate;
    }
    if (this.maintenanceType === 'immediate') {
      return !!this.endDate && this.today <= this.endDate;
    }
    return false;
  }

  showSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
}
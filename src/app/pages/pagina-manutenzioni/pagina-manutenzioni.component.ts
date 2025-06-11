import { Component, OnInit } from '@angular/core';

// INTERFACCE DATI
export interface SingleBike {
  id: number;
  modelName: string;
  propulsion: 'Muscolare' | 'Elettrica';
  status: 'Disponibile' | 'Noleggiata' | 'In Manutenzione';
  locationId: string;
  maintenanceEnd?: string; // Data di fine manutenzione (opzionale)
}

export interface Location {
  id: string;
  name: string;
}

// DATI MOCK
const mockBikesData: SingleBike[] = [
  // Stazione
  { id: 101, modelName: 'City Voyager X', propulsion: 'Muscolare', status: 'Disponibile', locationId: 'stazione' },
  { id: 102, modelName: 'City Voyager X', propulsion: 'Muscolare', status: 'Noleggiata', locationId: 'stazione' },
  { id: 103, modelName: 'City Voyager X', propulsion: 'Elettrica', status: 'Disponibile', locationId: 'stazione' },
  { id: 104, modelName: 'Mountain Peak E-Pro', propulsion: 'Elettrica', status: 'In Manutenzione', locationId: 'stazione', maintenanceEnd: '2025-06-20' },
  { id: 105, modelName: 'City Voyager X', propulsion: 'Muscolare', status: 'Disponibile', locationId: 'stazione' },

  // Rialto
  { id: 201, modelName: 'Rialto Sprinter', propulsion: 'Muscolare', status: 'Disponibile', locationId: 'rialto' },
  { id: 202, modelName: 'Rialto Sprinter', propulsion: 'Muscolare', status: 'Noleggiata', locationId: 'rialto' },
  { id: 203, modelName: 'Lagoon Cruiser E-Bike', propulsion: 'Elettrica', status: 'Disponibile', locationId: 'rialto' },
  { id: 204, modelName: 'Lagoon Cruiser E-Bike', propulsion: 'Elettrica', status: 'Disponibile', locationId: 'rialto' },

  // Lido
  { id: 301, modelName: 'Lido Beach Cruiser', propulsion: 'Muscolare', status: 'Disponibile', locationId: 'lido' },
  { id: 302, modelName: 'Lido Beach Cruiser', propulsion: 'Muscolare', status: 'In Manutenzione', locationId: 'lido', maintenanceEnd: '2025-06-15' },
  { id: 303, modelName: 'Mountain Peak Pro', propulsion: 'Muscolare', status: 'Disponibile', locationId: 'lido' },
];

const mockLocations: Location[] = [
  { id: 'stazione', name: 'Noleggio Centrale Stazione' },
  { id: 'rialto', name: 'Bike Point Rialto' },
  { id: 'lido', name: 'Deposito Lido' },
];


@Component({
  selector: 'app-pagina-manutenzioni',
  templateUrl: './pagina-manutenzioni.component.html',
  styleUrls: ['./pagina-manutenzioni.component.scss', './pagina-manutenzioni.component2.scss', './pagina-manutenzioni.component3.scss']
})
export class PaginaManutenzioniComponent implements OnInit {

  // --- STATO DEL COMPONENTE ---
  locations: Location[] = mockLocations;
  allBikes: SingleBike[] = mockBikesData;
  bikesForCurrentLocation: SingleBike[] = [];
  
  selectedLocationId: string = 'stazione';
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

  ngOnInit(): void {
    this.onLocationChange();
  }

  onLocationChange(): void {
    const selectedLocation = this.locations.find(loc => loc.id === this.selectedLocationId);
    if (selectedLocation) {
      this.selectedLocationName = selectedLocation.name;
      this.bikesForCurrentLocation = this.allBikes.filter(bike => bike.locationId === this.selectedLocationId);
    }
  }

  // --- GESTIONE MODALE ---
  openMaintenanceModal(bike: SingleBike): void {
    this.selectedBike = bike;
    this.isMaintenanceModalOpen = true;
    // Resetta lo stato interno del modale
    this.maintenanceType = null;
    this.startDate = '';
    this.endDate = '';
  }

  closeMaintenanceModal(): void {
    this.isMaintenanceModalOpen = false;
    // Un piccolo ritardo per permettere all'animazione di chiusura di completarsi
    setTimeout(() => {
      this.selectedBike = null;
    }, 300);
  }

  selectMaintenanceType(type: 'schedule' | 'immediate'): void {
    this.maintenanceType = type;
  }

  confirmMaintenance(): void {
    if (!this.selectedBike || !this.canConfirmMaintenance()) return;

    // Logica di aggiornamento della bici
    this.selectedBike.status = 'In Manutenzione';
    this.selectedBike.maintenanceEnd = this.endDate;

    console.log(`Manutenzione confermata per la bici #${this.selectedBike.id}`);
    console.log('Inizio:', this.maintenanceType === 'immediate' ? this.today : this.startDate);
    console.log('Fine:', this.endDate);

    this.closeMaintenanceModal();
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
}
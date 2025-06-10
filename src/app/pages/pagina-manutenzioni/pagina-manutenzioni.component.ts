import { Component, OnInit } from '@angular/core';

// --- INTERFACCE PER LA STRUTTURA DEI DATI ---
export interface BikeInventory {
  id: number;
  modelName: string;
  propulsion: 'Muscolare' | 'Elettrica';
  totalQuantity: number;
  currentlyRented: number;
  inMaintenance: number;
  originalInMaintenance: number; // Per tracciare le modifiche
}

export interface Location {
  id: string;
  name: string;
  inventory: BikeInventory[];
}

// --- MOCK DATA (Simula un database/API) ---
const mockInventoryData: Location[] = [
  {
    id: 'stazione',
    name: 'Noleggio Centrale Stazione',
    inventory: [
      { id: 1, modelName: 'City Voyager X', propulsion: 'Muscolare', totalQuantity: 15, currentlyRented: 4, inMaintenance: 1, originalInMaintenance: 1 },
      { id: 2, modelName: 'City Voyager X', propulsion: 'Elettrica', totalQuantity: 8, currentlyRented: 5, inMaintenance: 0, originalInMaintenance: 0 },
      { id: 3, modelName: 'Mountain Peak E-Pro', propulsion: 'Elettrica', totalQuantity: 10, currentlyRented: 2, inMaintenance: 2, originalInMaintenance: 2 },
    ],
  },
  {
    id: 'rialto',
    name: 'Bike Point Rialto',
    inventory: [
      { id: 4, modelName: 'Rialto Sprinter', propulsion: 'Muscolare', totalQuantity: 12, currentlyRented: 8, inMaintenance: 0, originalInMaintenance: 0 },
      { id: 5, modelName: 'Lagoon Cruiser E-Bike', propulsion: 'Elettrica', totalQuantity: 15, currentlyRented: 10, inMaintenance: 1, originalInMaintenance: 1 },
    ],
  },
  {
    id: 'lido',
    name: 'Deposito Lido',
    inventory: [
       { id: 6, modelName: 'Lido Beach Cruiser', propulsion: 'Muscolare', totalQuantity: 20, currentlyRented: 5, inMaintenance: 3, originalInMaintenance: 3 },
       { id: 7, modelName: 'Mountain Peak Pro', propulsion: 'Muscolare', totalQuantity: 7, currentlyRented: 2, inMaintenance: 0, originalInMaintenance: 0 },
    ],
  },
];


@Component({
  selector: 'app-pagina-manutenzioni',
  templateUrl: './pagina-manutenzioni.component.html',
  styleUrls: ['./pagina-manutenzioni.component.scss']
})
export class PaginaManutenzioniComponent implements OnInit {

  // --- STATO DEL COMPONENTE ---
  locations: Location[] = mockInventoryData;
  selectedLocationId: string = 'stazione';
  currentInventory: BikeInventory[] = [];
  selectedLocationName: string = '';

  // --- STATO DEI MODALI ---
  showConfirmationModal = false;
  showNotificationModal = false;
  notificationMessage = '';
  notificationSuccess = false;
  bikeToSave: BikeInventory | null = null;


  ngOnInit(): void {
    this.loadInventoryForSelectedLocation();
  }

  // --- GESTIONE CAMBIO PUNTO VENDITA ---
  onLocationChange(): void {
    this.loadInventoryForSelectedLocation();
  }

  private loadInventoryForSelectedLocation(): void {
    const selectedLocation = this.locations.find(loc => loc.id === this.selectedLocationId);
    if (selectedLocation) {
      this.selectedLocationName = selectedLocation.name;
      // Creiamo una copia profonda per evitare modifiche dirette ai dati mock
      this.currentInventory = JSON.parse(JSON.stringify(selectedLocation.inventory));
    }
  }

  // --- CALCOLO DINAMICO DISPONIBILITÀ ---
  getAvailability(bike: BikeInventory): number {
    return bike.totalQuantity - bike.currentlyRented - bike.inMaintenance;
  }

  getMaxMaintenanceValue(bike: BikeInventory): number {
    return bike.totalQuantity - bike.currentlyRented;
  }

  // --- GESTIONE MODALE DI CONFERMA ---
  openSaveConfirmation(bike: BikeInventory): void {
    this.bikeToSave = bike;
    this.showConfirmationModal = true;
  }

  cancelSave(): void {
    this.showConfirmationModal = false;
    this.bikeToSave = null;
  }

  // --- LOGICA DI SALVATAGGIO (SIMULATA) ---
  confirmSave(): void {
    if (!this.bikeToSave) return;

    // Simula una chiamata API con un ritardo
    console.log('Salvataggio dati per:', this.bikeToSave);
    setTimeout(() => {
      // Aggiorna il valore "originale" per riflettere il salvataggio
      this.bikeToSave!.originalInMaintenance = this.bikeToSave!.inMaintenance;
      
      // Aggiorna i dati master (in un'app reale, questi verrebbero ricaricati dal server)
      const location = this.locations.find(l => l.id === this.selectedLocationId);
      if(location) {
        const bikeInMaster = location.inventory.find(b => b.id === this.bikeToSave!.id);
        if (bikeInMaster) {
          Object.assign(bikeInMaster, this.bikeToSave);
        }
      }

      this.showConfirmationModal = false;
      this.showNotification('Modifiche salvate con successo!', true);
      this.bikeToSave = null;
    }, 1000); // Ritardo di 1 secondo
  }

  // --- GESTIONE MODALE DI NOTIFICA ---
  private showNotification(message: string, isSuccess: boolean): void {
    this.notificationMessage = message;
    this.notificationSuccess = isSuccess;
    this.showNotificationModal = true;
  }

  closeNotification(): void {
    this.showNotificationModal = false;
  }
}
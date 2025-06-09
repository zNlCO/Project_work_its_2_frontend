import { Component } from '@angular/core';

// Interfacce per i dati
interface BikeInventory {
  type: string;
  powerType: 'Muscolare' | 'Elettrica';
  size: 'S' | 'M' | 'L' | 'XL';
  quantity: number;
}

interface SalesPoint {
  id: number;
  name: string;
  address: string;
  bikes: BikeInventory[];
  active: boolean;
}

@Component({
  selector: 'app-puntivendita',
  templateUrl: './puntivendita.component.html',
  styleUrl: './puntivendita.component.scss'
})
export class PuntivenditaComponent {
  // Dati dei punti vendita
  salesPoints: SalesPoint[] = [
    {
      id: 1,
      name: 'Noleggio Centrale Stazione',
      address: 'Piazza della Stazione, 1 - 30100 Venezia VE',
      active: true,
      bikes: [
        { type: 'City bike', powerType: 'Muscolare', size: 'M', quantity: 5 },
        { type: 'City bike', powerType: 'Elettrica', size: 'S', quantity: 3 },
        { type: 'Mountain bike', powerType: 'Muscolare', size: 'L', quantity: 4 },
        { type: 'Road bike', powerType: 'Muscolare', size: 'M', quantity: 2 }
      ]
    },
    {
      id: 2,
      name: 'Bike Point Rialto',
      address: 'Riva del Ferro, Ponte di Rialto - 30124 Venezia VE',
      active: true,
      bikes: [
        { type: 'Gravel', powerType: 'Muscolare', size: 'L', quantity: 6 },
        { type: 'City bike', powerType: 'Elettrica', size: 'M', quantity: 4 },
        { type: 'Road bike', powerType: 'Elettrica', size: 'XL', quantity: 2 }
      ]
    },
    {
      id: 3,
      name: 'Deposito Lido Noleggi',
      address: 'Via Sandro Gallo, Lido - 30126 Venezia VE',
      active: true,
      bikes: []
    }
  ];

  filteredSalesPoints: SalesPoint[] = [...this.salesPoints];
  searchTerm: string = '';

  // Stati dei modali
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showInventoryModal: boolean = false;
  showDeleteModal: boolean = false;

  // Dati per i modali
  selectedSalesPoint: SalesPoint | null = null;
  editingSalesPoint: Partial<SalesPoint> = {};
  newSalesPoint: Partial<SalesPoint> = { name: '', address: '', active: true, bikes: [] };

  // Dati per il modale inventario
  editingBike: Partial<BikeInventory> = {};
  showAddBikeModal: boolean = false;
  editingBikeIndex: number = -1;

  // Opzioni per i dropdown
  bikeTypes = ['City bike', 'Mountain bike', 'Road bike', 'Gravel', 'E-bike', 'Touring'];
  powerTypes: Array<'Muscolare' | 'Elettrica'> = ['Muscolare', 'Elettrica'];
  bikeSizes: Array<'S' | 'M' | 'L' | 'XL'> = ['S', 'M', 'L', 'XL'];

  // Metodi per la ricerca
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredSalesPoints = [...this.salesPoints];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredSalesPoints = this.salesPoints.filter(sp => 
      sp.name.toLowerCase().includes(term) || 
      sp.address.toLowerCase().includes(term)
    );
  }

  // Metodi per gestire i modali principali
  openAddModal(): void {
    this.newSalesPoint = { name: '', address: '', active: true, bikes: [] };
    this.showAddModal = true;
  }

  openEditModal(salesPoint: SalesPoint): void {
    this.selectedSalesPoint = salesPoint;
    this.editingSalesPoint = { ...salesPoint };
    this.showEditModal = true;
  }

  openInventoryModal(salesPoint: SalesPoint): void {
    this.selectedSalesPoint = salesPoint;
    this.showInventoryModal = true;
  }

  openDeleteModal(salesPoint: SalesPoint): void {
    this.selectedSalesPoint = salesPoint;
    this.showDeleteModal = true;
  }

  closeAllModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showInventoryModal = false;
    this.showDeleteModal = false;
    this.showAddBikeModal = false;
    this.selectedSalesPoint = null;
    this.editingSalesPoint = {};
    this.newSalesPoint = { name: '', address: '', active: true, bikes: [] };
    this.editingBike = {};
    this.editingBikeIndex = -1;
  }

  // Metodi per gestire i punti vendita
  addSalesPoint(): void {
    if (this.newSalesPoint.name && this.newSalesPoint.address) {
      const newId = Math.max(...this.salesPoints.map(sp => sp.id)) + 1;
      const newPoint: SalesPoint = {
        id: newId,
        name: this.newSalesPoint.name,
        address: this.newSalesPoint.address,
        active: this.newSalesPoint.active || true,
        bikes: []
      };
      
      this.salesPoints.push(newPoint);
      this.filteredSalesPoints = [...this.salesPoints];
      this.closeAllModals();
    }
  }

  updateSalesPoint(): void {
    if (this.selectedSalesPoint && this.editingSalesPoint.name && this.editingSalesPoint.address) {
      const index = this.salesPoints.findIndex(sp => sp.id === this.selectedSalesPoint!.id);
      if (index !== -1) {
        this.salesPoints[index] = {
          ...this.salesPoints[index],
          name: this.editingSalesPoint.name,
          address: this.editingSalesPoint.address,
          active: this.editingSalesPoint.active !== undefined ? this.editingSalesPoint.active : true
        };
        this.filteredSalesPoints = [...this.salesPoints];
      }
      this.closeAllModals();
    }
  }

  deleteSalesPoint(): void {
    if (this.selectedSalesPoint) {
      this.salesPoints = this.salesPoints.filter(sp => sp.id !== this.selectedSalesPoint!.id);
      this.filteredSalesPoints = [...this.salesPoints];
      this.closeAllModals();
    }
  }

  // Metodi per gestire l'inventario bici
  openAddBikeModal(): void {
    this.editingBike = { type: '', powerType: 'Muscolare', size: 'M', quantity: 1 };
    this.editingBikeIndex = -1;
    this.showAddBikeModal = true;
  }

  openEditBikeModal(bike: BikeInventory, index: number): void {
    this.editingBike = { ...bike };
    this.editingBikeIndex = index;
    this.showAddBikeModal = true;
  }

  saveBike(): void {
    if (this.selectedSalesPoint && this.editingBike.type && 
        this.editingBike.powerType && this.editingBike.size && 
        this.editingBike.quantity !== undefined && this.editingBike.quantity > 0) {
      
      const salesPointIndex = this.salesPoints.findIndex(sp => sp.id === this.selectedSalesPoint!.id);
      if (salesPointIndex !== -1) {
        const newBike: BikeInventory = {
          type: this.editingBike.type,
          powerType: this.editingBike.powerType,
          size: this.editingBike.size,
          quantity: this.editingBike.quantity
        };

        if (this.editingBikeIndex === -1) {
          // Aggiungi nuova bici
          this.salesPoints[salesPointIndex].bikes.push(newBike);
        } else {
          // Modifica bici esistente
          this.salesPoints[salesPointIndex].bikes[this.editingBikeIndex] = newBike;
        }
        
        this.filteredSalesPoints = [...this.salesPoints];
      }
      this.showAddBikeModal = false;
      this.editingBike = {};
      this.editingBikeIndex = -1;
    }
  }

  deleteBike(index: number): void {
    if (this.selectedSalesPoint) {
      const salesPointIndex = this.salesPoints.findIndex(sp => sp.id === this.selectedSalesPoint!.id);
      if (salesPointIndex !== -1) {
        this.salesPoints[salesPointIndex].bikes.splice(index, 1);
        this.filteredSalesPoints = [...this.salesPoints];
      }
    }
  }

  // Metodi di utilità
  getTotalBikes(salesPoint: SalesPoint): number {
    return salesPoint.bikes.reduce((total, bike) => total + bike.quantity, 0);
  }

  closeBikeModal(): void {
    this.showAddBikeModal = false;
    this.editingBike = {};
    this.editingBikeIndex = -1;
  }
}
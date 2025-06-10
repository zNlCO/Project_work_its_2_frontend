import { Component, OnInit } from '@angular/core';

// Tipi per maggiore sicurezza
type BikeSize = 'S' | 'M' | 'L' | 'XL';
type BikeCategory = 'City bike' | 'Mountain bike' | 'Gravel' | 'Road bike';
type BikePropulsion = 'Muscolare' | 'Elettrica';

// Interfaccia per definire la struttura di un tipo di bici
interface BikeType {
  id: number;
  name: string;
  category: BikeCategory;
  propulsion: BikePropulsion;
  size: BikeSize;
  hourlyPrice: number;
}

@Component({
  selector: 'app-gestionebiciclette',
  templateUrl: './gestionebiciclette.component.html',
  styleUrls: ['./gestionebiciclette.component.scss']
})
export class GestionebicicletteComponent implements OnInit {

  public allBikeTypes: BikeType[] = [];
  public filteredBikeTypes: BikeType[] = [];
  public searchTerm: string = '';

  public showAddEditModal: boolean = false;
  public showDeleteModal: boolean = false;
  public isEditMode: boolean = false;

  public currentBikeType: Partial<BikeType> = {};

  // Dati per i dropdown dei form
  public readonly availableCategories: BikeCategory[] = ['City bike', 'Mountain bike', 'Gravel', 'Road bike'];
  public readonly availablePropulsions: BikePropulsion[] = ['Muscolare', 'Elettrica'];
  public readonly availableSizes: BikeSize[] = ['S', 'M', 'L', 'XL'];

  constructor() { }

  ngOnInit(): void {
    this.loadMockData();
  }

  private loadMockData(): void {
    this.allBikeTypes = [
      { id: 1, name: 'City Voyager X', category: 'City bike', propulsion: 'Muscolare', size: 'S', hourlyPrice: 8.50 },
      { id: 2, name: 'City Voyager X', category: 'City bike', propulsion: 'Muscolare', size: 'M', hourlyPrice: 8.50 },
      { id: 3, name: 'City Voyager X', category: 'City bike', propulsion: 'Muscolare', size: 'L', hourlyPrice: 8.50 },
      { id: 4, name: 'Mountain Peak E-Pro', category: 'Mountain bike', propulsion: 'Elettrica', size: 'M', hourlyPrice: 15.00 },
      { id: 5, name: 'Mountain Peak E-Pro', category: 'Mountain bike', propulsion: 'Elettrica', size: 'L', hourlyPrice: 15.00 },
      { id: 6, name: 'Gravel Pathfinder', category: 'Gravel', propulsion: 'Muscolare', size: 'M', hourlyPrice: 12.00 },
      { id: 7, name: 'Road Sprinter SL', category: 'Road bike', propulsion: 'Muscolare', size: 'L', hourlyPrice: 10.50 }
    ];
    this.applyFilters();
  }

  public onSearch(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredBikeTypes = [...this.allBikeTypes];
    } else {
      this.filteredBikeTypes = this.allBikeTypes.filter(bike =>
        bike.name.toLowerCase().includes(term) ||
        bike.category.toLowerCase().includes(term)
      );
    }
  }

  // --- Gestione Modali ---
  public openAddModal(): void {
    this.isEditMode = false;
    this.currentBikeType = { 
      name: '', 
      category: 'City bike', 
      propulsion: 'Muscolare', 
      size: 'M',
      hourlyPrice: 8.00
    };
    this.showAddEditModal = true;
  }

  public openEditModal(bikeType: BikeType): void {
    this.isEditMode = true;
    this.currentBikeType = { ...bikeType };
    this.showAddEditModal = true;
  }

  public openDeleteModal(bikeType: BikeType): void {
    this.currentBikeType = bikeType;
    this.showDeleteModal = true;
  }

  public closeModals(): void {
    this.showAddEditModal = false;
    this.showDeleteModal = false;
    this.currentBikeType = {};
  }

  public saveBikeType(): void {
    if (!this.isFormValid()) {
      console.warn('Tutti i campi sono obbligatori e il prezzo deve essere maggiore di 0');
      return;
    }

    if (this.isEditMode) {
      this.updateExistingBike();
    } else {
      this.addNewBike();
    }

    this.applyFilters();
    this.closeModals();
  }

  private isFormValid(): boolean {
    return !!(
      this.currentBikeType.name?.trim() && 
      this.currentBikeType.category && 
      this.currentBikeType.propulsion && 
      this.currentBikeType.size && 
      this.currentBikeType.hourlyPrice && 
      this.currentBikeType.hourlyPrice > 0
    );
  }

  private updateExistingBike(): void {
    const index = this.allBikeTypes.findIndex(bike => bike.id === this.currentBikeType.id);
    if (index !== -1) {
      this.allBikeTypes[index] = { ...this.currentBikeType } as BikeType;
      console.log('Bici modificata:', this.currentBikeType);
    }
  }

  private addNewBike(): void {
    const newBike: BikeType = {
      id: this.generateNewId(),
      name: this.currentBikeType.name!.trim(),
      category: this.currentBikeType.category!,
      propulsion: this.currentBikeType.propulsion!,
      size: this.currentBikeType.size!,
      hourlyPrice: this.currentBikeType.hourlyPrice!
    };
    this.allBikeTypes.push(newBike);
    console.log('Nuova bici creata:', newBike);
  }

  private generateNewId(): number {
    return Math.max(...this.allBikeTypes.map(b => b.id), 0) + 1;
  }

  public deleteBikeType(): void {
    if (this.currentBikeType.id) {
      this.allBikeTypes = this.allBikeTypes.filter(bike => bike.id !== this.currentBikeType.id);
      this.applyFilters();
      console.log('Bici eliminata:', this.currentBikeType);
    }
    this.closeModals();
  }
}
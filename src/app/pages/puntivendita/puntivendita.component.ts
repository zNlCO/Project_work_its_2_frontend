import { Component, OnInit } from '@angular/core';
import { Store, StoreService } from '../../services/store.service';
import { Bike, BikeInput, BikeService } from '../../services/bike.service';
import { BikeModel, BikeModelService } from '../../services/bike-model.service';

@Component({
  selector: 'app-puntivendita',
  templateUrl: './puntivendita.component.html',
  styleUrl: './puntivendita.component.scss',
})
export class PuntivenditaComponent implements OnInit {
  stores: (Store & { bikes?: Bike[] })[] = [];
  filteredStores: (Store & { bikes?: Bike[] })[] = [];
  bikeModels: BikeModel[] = [];
  searchTerm = '';

  // Modal state
  showAddModal = false;
  showEditBikeModal = false;
  showInventoryModal = false;
  showAddBikeModal = false;
  showDeleteModal = false;

  // Store modals
  newStore: Store = { location: '' };
  editingStore: Store | null = null;
  selectedStore: (Store & { bikes?: Bike[] }) | null = null;

  // Bike modals
  editingBike: Bike | null = null;
  editingBikeIndex: number = -1;

  constructor(
    private storeSrv: StoreService,
    private bikeSrv: BikeService,
    private bikeModelSrv: BikeModelService
  ) {}

  ngOnInit() {
    this.loadStores();
    this.loadBikeModels();
  }

  loadStores() {
    this.storeSrv.getStores().subscribe((stores) => {
      this.stores = [];
      let loaded = 0;
      if (stores.length === 0) this.filteredStores = [];
      stores.forEach((store) => {
        this.bikeSrv.getBikesByPuntoVendita(store._id!).subscribe((bikes) => {
          this.stores.push({ ...store, bikes });
          loaded++;
          if (loaded === stores.length) {
            this.filteredStores = [...this.stores];
          }
        });
      });
    });
  }

  loadBikeModels() {
    this.bikeModelSrv.getBikeModels().subscribe((models) => {
      this.bikeModels = models;
    });
  }

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredStores = [...this.stores];
      return;
    }
    this.filteredStores = this.stores.filter((store) =>
      store.location.toLowerCase().includes(term)
    );
  }

  // --- Store CRUD ---
  openAddModal() {
    this.newStore = { location: '' };
    this.showAddModal = true;
  }

  addStore() {
    this.storeSrv.createStore(this.newStore).subscribe((store) => {
      this.stores.push({ ...store, bikes: [] });
      this.filteredStores = [...this.stores];
      this.showAddModal = false;
    });
  }

  openEditModal(store: Store) {
    this.editingStore = { ...store };
    this.showEditBikeModal = true;
  }

  updateStore() {
    if (!this.editingStore) return;
    this.storeSrv.updateStore(this.editingStore).subscribe((updatedStore) => {
      const idx = this.stores.findIndex((s) => s._id === updatedStore._id);
      if (idx > -1) {
        // Mantieni le bici già caricate
        const bikes = this.stores[idx].bikes;
        this.stores[idx] = { ...updatedStore, bikes };
        this.filteredStores = [...this.stores];
      }
      this.closeAllModals();
    });
  }

  openDeleteModal(store: Store) {
    console.log(store);
    this.selectedStore = store;
    this.showDeleteModal = true;
  }

  deleteStore() {
    if (!this.selectedStore?._id) return;
    this.storeSrv.deleteStore(this.selectedStore._id).subscribe(() => {
      this.stores = this.stores.filter(
        (s) => s._id !== this.selectedStore!._id
      );
      this.filteredStores = [...this.stores];
      this.closeAllModals();
    });
  }

  // --- Inventory ---
  openInventoryModal(store: Store & { bikes?: Bike[] }) {
    this.selectedStore = store;
    this.showInventoryModal = true;
  }

  // --- Bike CRUD ---
  openAddBikeModal() {
    this.editingBike = {
      idPuntoVendita: this.selectedStore!._id!,
      idModello: this.bikeModels[0],
      quantity: 1,
    };
    this.editingBikeIndex = -1;
    this.showAddBikeModal = true;
  }

  openEditBikeModal(bike: Bike, index: number) {
    this.editingBike = { ...bike };
    console.log(this.editingBike);
    this.editingBikeIndex = index;
    this.showEditBikeModal = true;
  }

  saveBike() {
    if (!this.editingBike) return;
    if (this.editingBikeIndex === -1) {
      // Add
      var bikeInput: BikeInput = {
        idPuntoVendita: this.editingBike.idPuntoVendita,
        idModello: this.editingBike.idModello._id!,
        quantity: this.editingBike.quantity,
      };
      this.bikeSrv.createBike(bikeInput).subscribe((bike) => {
        this.selectedStore!.bikes = this.selectedStore!.bikes || [];
        // check if the bike model alredy exist, if exist delete the old one
        this.selectedStore!.bikes = this.selectedStore!.bikes.filter(
          (b) => b.idModello._id !== this.editingBike!.idModello._id
        );
        this.selectedStore!.bikes.push(bike);
        this.showAddBikeModal = false;
      });
    } else {
      // Update
      var bikeInput: BikeInput = {
        _id: this.editingBike._id,
        idPuntoVendita: this.editingBike.idPuntoVendita,
        idModello: this.editingBike.idModello._id!,
        quantity: this.editingBike.quantity,
      };
      this.bikeSrv.updateBike(bikeInput).subscribe((bike) => {
        this.selectedStore!.bikes![this.editingBikeIndex] = bike;
        this.showEditBikeModal = false;
      });
    }
  }

  deleteBike(index: number) {
    const bike = this.selectedStore!.bikes![index];
    if (!bike._id) return;
    this.bikeSrv.deleteBike(bike._id).subscribe(() => {
      this.selectedStore!.bikes!.splice(index, 1);
    });
  }

  closeAllModals() {
    this.showAddModal = false;
    this.showEditBikeModal = false;
    this.showInventoryModal = false;
    this.showAddBikeModal = false;
    this.showDeleteModal = false;
    this.selectedStore = null;
    this.editingStore = null;
    this.editingBike = null;
    this.editingBikeIndex = -1;
  }

  closeBikeModal() {
    this.showAddBikeModal = false;
    this.showEditBikeModal = false;
    this.editingBike = null;
    this.editingBikeIndex = -1;
  }
}

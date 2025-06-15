import { Component, OnInit } from '@angular/core';
import { BikeModel, BikeModelService } from '../../services/bike-model.service';

@Component({
  selector: 'app-gestionebiciclette',
  templateUrl: './gestionebiciclette.component.html',
  styleUrls: ['./gestionebiciclette.component.scss']
})
export class GestionebicicletteComponent implements OnInit {
  bikeModels: BikeModel[] = [];
  showModal = false;
  isEditMode = false;
  currentModel: BikeModel = this.emptyModel();

  bikeTypes = ['Mountain bike', 'City bike', 'Road bike', 'Gravel'];
  availableSizes = ['S', 'M', 'L', 'XL'];

  constructor(private bikeModelSrv: BikeModelService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.bikeModelSrv.getBikeModels().subscribe(res => {
      this.bikeModels = res
    })
  }
  
  emptyModel(): BikeModel {
    return {
      descrizione: '',
      type: '',
      size: '',
      elettrica: false,
      prezzo: 0,
      imgUrl: ''
    };
  }

  openAdd() {
    this.isEditMode = false;
    this.currentModel = this.emptyModel();
    this.showModal = true;
  }

  openEdit(model: BikeModel) {
    this.isEditMode = true;
    this.currentModel = { ...model };
    this.showModal = true;
  }

  save() {
    if (this.isEditMode) {
      this.bikeModelSrv.updateBikeModel(this.currentModel).subscribe(
        bike => {
            const idx = this.bikeModels.findIndex(b => b._id === bike._id);
            if (idx > -1) {
                this.bikeModels[idx] = bike;
            }
        }
      );
    } else {
      this.bikeModelSrv.createBikeModel(this.currentModel).subscribe(bike => {
        this.bikeModels.push(bike);
      });
    }
    this.showModal = false;
  }

  delete(id: string | undefined) {
    if (!id) return;
    if (confirm('Sei sicuro di voler eliminare questo modello?')) {
      this.bikeModelSrv.deleteBikeModel(id).subscribe(() => {
        this.bikeModels = this.bikeModels.filter(b => b._id !== id);
      });
    }
  }
}
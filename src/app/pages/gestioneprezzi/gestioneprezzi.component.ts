import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InsuranceService, Insurance } from '../../services/insurance.service';

// Definiamo delle interfacce per una migliore tipizzazione
export interface Accessorio {
  _id: string;  // Cambiato da id a _id per allinearsi con il backend
  descrizione: string;
  prezzo: number;
}

@Component({
  selector: 'app-gestioneprezzi',
  templateUrl: './gestioneprezzi.component.html',
  styleUrls: ['./gestioneprezzi.component.scss']
})
export class GestioneprezziComponent implements OnInit {
  // Dati degli accessori gestiti dal componente
  accessori: Accessorio[] = [];

  // Dati delle assicurazioni gestiti dal componente
  assicurazioni: Insurance[] = [];

  // Stato del modale
  isModalOpen = false;
  editingItem: Accessorio | Insurance | null = null;
  editedPrice: number = 0;
  modalTitle: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private insuranceService: InsuranceService
  ) { }

  ngOnInit() {
    this.loadAccessori();
    this.loadAssicurazioni();
  }

  loadAccessori() {
    this.http.get<{message: string, data: any[]}>(`${this.insuranceService.conStr}/api/accessories`).subscribe({
      next: (response) => {
        // Mappiamo i dati dal backend al formato che ci serve
        this.accessori = response.data.map(item => ({
          _id: item._id,
          descrizione: item.descrizione,
          prezzo: item.prezzo
        }));
      },
      error: (error) => {
        console.error('Errore nel caricamento degli accessori:', error);
        this.errorMessage = 'Errore nel caricamento degli accessori';
      }
    });
  }

  loadAssicurazioni() {
    this.insuranceService.getInsurances().subscribe({
      next: (data) => {
        this.assicurazioni = data;
      },
      error: (error) => {
        console.error('Errore nel caricamento delle assicurazioni:', error);
        this.errorMessage = 'Errore nel caricamento delle assicurazioni';
      }
    });
  }

  /**
   * Apre il modale per modificare un elemento.
   * @param item L'accessorio o l'assicurazione da modificare.
   * @param type Il tipo di elemento ('Accessorio' o 'Assicurazione') per impostare il titolo.
   */
  openEditModal(item: Accessorio | Insurance, type: 'Accessorio' | 'Assicurazione'): void {
    this.editingItem = item;
    this.editedPrice = item.prezzo;
    this.modalTitle = `Modifica Prezzo ${type}: ${item.descrizione}`;
    this.isModalOpen = true;
    this.errorMessage = '';
  }

  /**
   * Chiude il modale resettando lo stato.
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.editingItem = null;
    this.editedPrice = 0;
    this.modalTitle = '';
    this.errorMessage = '';
  }

  /**
   * Salva il nuovo prezzo e chiude il modale.
   * In un'applicazione reale, qui si farebbe una chiamata API al backend.
   */
  savePrice(): void {
    if (!this.editingItem) return;

    // Verifica se è un accessorio o un'assicurazione
    const isAccessorio = 'descrizione' in this.editingItem && '_id' in this.editingItem;

    if (isAccessorio) {
      // Aggiorna accessorio
      const accessorio = this.editingItem as Accessorio;
      const updateData = {
        descrizione: accessorio.descrizione,
        prezzo: this.editedPrice
      };

      console.log('Dati inviati al backend:', updateData); // Debug

      this.http.put<{message: string, data: any}>(`${this.insuranceService.conStr}/api/accessories/update/${accessorio._id}`, updateData).subscribe({
        next: (response) => {
          console.log('Risposta dal backend:', response); // Debug
          const index = this.accessori.findIndex(a => a._id === accessorio._id);
          if (index !== -1) {
            this.accessori[index].prezzo = this.editedPrice;
          }
          this.closeModal();
        },
        error: (error) => {
          console.error('Errore completo:', error); // Debug dettagliato
          this.errorMessage = error.error?.message || 'Errore durante l\'aggiornamento dell\'accessorio';
        }
      });
    } else {
      // Aggiorna assicurazione
      const assicurazione = this.editingItem as Insurance;
      this.insuranceService.updateInsurance({
        _id: assicurazione._id,
        descrizione: assicurazione.descrizione,
        prezzo: this.editedPrice
      }).subscribe({
        next: (updatedInsurance) => {
          const index = this.assicurazioni.findIndex(a => a._id === updatedInsurance._id);
          if (index !== -1) {
            this.assicurazioni[index] = updatedInsurance;
          }
          this.closeModal();
        },
        error: (error) => {
          console.error('Errore durante l\'aggiornamento dell\'assicurazione:', error);
          this.errorMessage = error.error?.message || 'Errore durante l\'aggiornamento dell\'assicurazione';
        }
      });
    }
  }
}
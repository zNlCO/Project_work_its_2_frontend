import { Component } from '@angular/core';

// Definiamo delle interfacce per una migliore tipizzazione
export interface Accessorio {
  id: number;
  nome: string;
  descrizione: string;
  prezzo: number;
}

export interface Assicurazione {
  id: number;
  nome: string;
  dettagli: string;
  prezzo: number;
}

@Component({
  selector: 'app-gestioneprezzi',
  templateUrl: './gestioneprezzi.component.html',
  styleUrls: ['./gestioneprezzi.component.scss'] // Corretto da styleUrl a styleUrls
})
export class GestioneprezziComponent {

  // Dati degli accessori gestiti dal componente
  accessori: Accessorio[] = [
    { id: 1, nome: 'Casco Protettivo', descrizione: 'Casco omologato, varie misure', prezzo: 3.00 },
    { id: 2, nome: 'Lucchetto di Sicurezza', descrizione: 'Lucchetto rinforzato con cavo', prezzo: 2.00 },
    { id: 3, nome: 'Kit Luci LED', descrizione: 'Set luci anteriore e posteriore ad alta visibilità', prezzo: 4.00 },
    { id: 4, nome: 'Borraccia Termica', descrizione: 'Borraccia da 500ml, mantiene temperatura', prezzo: 5.00 }
  ];

  // Dati delle assicurazioni gestiti dal componente
  assicurazioni: Assicurazione[] = [
    { id: 1, nome: 'Copertura Base Danni', dettagli: 'Copre danni accidentali alla bici fino a €200.', prezzo: 5.00 },
    { id: 2, nome: 'Copertura Kasko Completa', dettagli: 'Danni illimitati, furto (con franchigia), assistenza stradale.', prezzo: 15.00 },
    { id: 3, nome: 'Servizio Emergenza Plus', dettagli: 'Recupero entro 50km e sostituzione bici.', prezzo: 7.50 }
  ];

  // Stato del modale
  isModalOpen = false;
  editingItem: Accessorio | Assicurazione | null = null;
  editedPrice: number = 0;
  modalTitle: string = '';

  constructor() { }

  /**
   * Apre il modale per modificare un elemento.
   * @param item L'accessorio o l'assicurazione da modificare.
   * @param type Il tipo di elemento ('Accessorio' o 'Assicurazione') per impostare il titolo.
   */
  openEditModal(item: Accessorio | Assicurazione, type: 'Accessorio' | 'Assicurazione'): void {
    this.editingItem = item;
    this.editedPrice = item.prezzo; // Imposta il prezzo corrente nell'input del modale
    this.modalTitle = `Modifica Prezzo ${type}: ${item.nome}`;
    this.isModalOpen = true;
  }

  /**
   * Chiude il modale resettando lo stato.
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.editingItem = null;
    this.editedPrice = 0;
    this.modalTitle = '';
  }

  /**
   * Salva il nuovo prezzo e chiude il modale.
   * In un'applicazione reale, qui si farebbe una chiamata API al backend.
   */
  savePrice(): void {
    if (this.editingItem) {
      this.editingItem.prezzo = this.editedPrice;
      console.log('Prezzo salvato per:', this.editingItem.nome, 'Nuovo prezzo:', this.editingItem.prezzo);
      // Qui andrebbe la logica per salvare i dati sul server
    }
    this.closeModal();
  }
}
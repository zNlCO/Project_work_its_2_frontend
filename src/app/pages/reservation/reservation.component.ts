import { Component, OnInit } from '@angular/core';
import { Bike, BikeService } from '../../services/bike.service';
import { Store, StoreService } from '../../services/store.service';
import { Accessory, AccessoryService } from '../../services/accessory.service';
import { Insurance, InsuranceService } from '../../services/insurance.service';
import {
  AccessoryGualti,
  BikeGualti,
  InsuranceGualti,
  PrenotazioneBikeGualti,
  PrenotazioneInput,
  PrenotazioneInputPol,
  PrenotazioneService,
} from '../../services/prenotazione.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss', '../../app.component.scss'],
})
export class ReservationComponent implements OnInit {
  currentStep = 1;

  // Step 1
  stores: Store[] = [];
  pickupLocation?: Store;
  dropoffLocation?: Store;
  pickupDate: string = '';
  dropoffDate: string = '';
  pickupTime: string = '09:00';
  dropoffTime: string = '10:00';
  hours: string[] = [];
  invalidDateRange = false;
  today = '';

  // Step 2
  selectedBikes: PrenotazioneBikeGualti[] = [];
  accessori: AccessoryGualti[] = [];
  assicurazioni: InsuranceGualti[] = [];
  bikeDisponibili: BikeGualti[] = [];
  prenotazioneInput?: PrenotazioneInput;
  showAuthPopup = false;
  showSuccessPopup = false;
  noBikesAvailable = false;

  constructor(
    protected bikeSrv: BikeService,
    protected storeSrv: StoreService,
    protected accessorySrv: AccessoryService,
    protected insuranceSrv: InsuranceService,
    protected prenotazioneSrv: PrenotazioneService,
    protected authSrv: AuthService
  ) {
    this.generateHours();
  }

  // Generale

  ngOnInit(): void {
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
    this.storeSrv.getStores().subscribe((stores) => {
      this.stores = stores;
    });
    this.accessorySrv.getAccessoriesGualti().subscribe((accesories) => {
      this.accessori = accesories;
    });
    this.insuranceSrv.getInsurancesGualti().subscribe((insurances) => {
      this.assicurazioni = insurances;
    });

    const data = localStorage.getItem('pendingPrenotazione');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.expiresAt > Date.now()) {
        const prenotazioneId: string = parsed.prenotazione;
        // from prenotazioneId
        this.prenotazioneSrv
          .getPrenotazione(prenotazioneId)
          .subscribe((prenotazioni) => {
            const start = new Date(prenotazioni.start);
            const stop = new Date(prenotazioni.stop);

            this.pickupDate = start.toISOString().slice(0, 10);
            this.pickupTime = start.toISOString().slice(11, 16);
            this.dropoffDate = stop.toISOString().slice(0, 10);
            this.dropoffTime = stop.toISOString().slice(11, 16);
            this.pickupLocation = prenotazioni.pickupLocation;
            this.dropoffLocation = prenotazioni.dropLocation;
            prenotazioni.bikes.forEach((prenotazioneBike) => {
              this.selectedBikes.push({
                _id: prenotazioneBike._id,
                id: prenotazioneBike.id,
                quantity: 1,
                accessori: prenotazioneBike.accessori,
                assicurazione: prenotazioneBike.assicurazione,
              });
            });
            this.goToStep(2);
          });
        // puoi riusare questo per ricaricare il form o reinviarlo
      } else {
        localStorage.removeItem('pendingPrenotazione'); // scaduto
      }
    }
  }

  generateHours() {
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0');
      this.hours.push(`${hour}:00`);
    }
  }

  goToStep(step: number) {
    if (this.invalidDateRange) return; // blocca il passaggio
    this.currentStep = step;

    if (this.currentStep == 2) {
      var start: Date = new Date(`${this.pickupDate}T${this.pickupTime}`);
      var end: Date = new Date(`${this.dropoffDate}T${this.dropoffTime}`);
      this.bikeSrv
        .getBikesDisponibiliGualti(start, end, this.pickupLocation?._id!)
        .subscribe((bikes) => {
          this.bikeDisponibili = bikes;
          this.noBikesAvailable = bikes.length === 0;
        });
    }
  }

  // Step 1

  autoFillDropoff() {
    if (!this.dropoffLocation || this.dropoffLocation === this.pickupLocation) {
      this.dropoffLocation = this.pickupLocation;
    }
  }

  checkDates() {
    if (
      !this.pickupDate ||
      !this.dropoffDate ||
      !this.pickupTime ||
      !this.dropoffTime
    ) {
      this.invalidDateRange = false;
      return;
    }

    const start = new Date(`${this.pickupDate}T${this.pickupTime}`);
    const end = new Date(`${this.dropoffDate}T${this.dropoffTime}`);
    this.invalidDateRange = end <= start;
  }

  // STEP 2
  addBike(id: BikeGualti) {
    this.selectedBikes.push({
      _id: '',
      quantity: 1,
      accessori: [],
      assicurazione: null,
      id,
    });
  }

  removeBike(index: number) {
    this.selectedBikes.splice(index, 1);
  }

  getAccessoriesTotalPrice(accessoryIds: AccessoryGualti[]): number {
    if (!accessoryIds || !Array.isArray(accessoryIds)) return 0;
    var ids = this.convertFromAccessoryGualtiToString(accessoryIds);
    return ids
      .map((id) => this.accessori.find((a) => a._id === id)?.prezzo || 0)
      .reduce((sum, price) => sum + price, 0);
  }

  getInsurancePrice(insuranceId: InsuranceGualti) {
    if (!insuranceId || !insuranceId._id) {
      return 0;
    }

    const insurance = this.assicurazioni.find(
      (insurance) => insurance._id === insuranceId._id
    );
    return insurance ? insurance.prezzo : 0;
  }

  getBikeTotalPrice(selectedBike: PrenotazioneBikeGualti): number {
    const bikePricePerHour = selectedBike?.id.idModello?.prezzo || 0;
    const accessoriesPrice = this.getAccessoriesTotalPrice(
      selectedBike.accessori
    );
    const insurancePrice =
      this.getInsurancePrice(selectedBike.assicurazione!) || 0;

    // Calcolo ore totali di prenotazione
    const start = new Date(`${this.pickupDate}T${this.pickupTime}`);
    const end = new Date(`${this.dropoffDate}T${this.dropoffTime}`);

    const bikeTotal =
      bikePricePerHour * this.calcolaOreNoleggioMezzeGiornate8_18(start, end);
    return bikeTotal + accessoriesPrice + insurancePrice;
  }

  confirmGoBack() {
    if (this.currentStep == 1) return;
    const conferma = window.confirm(
      'Attenzione: se torni indietro perderai i dati di questa sezione. Continuare?'
    );
    if (conferma) {
      this.goToStep(1);
    }
  }

  prenota() {
    // if authenticated save id
    var idUser: string | undefined;
    if (this.authSrv.isLoggedIn()) {
      this.authSrv.currentUser$.subscribe((user) => (idUser = user?.id));
    }

    if (!idUser) {
      const prenotazioneInput: PrenotazioneInput = {
        bikes: this.selectedBikes.map((selectedBike) => ({
          id: selectedBike.id._id ?? '',
          quantity: 1,
          accessori:
            this.convertFromAccessoryGualtiToString(selectedBike.accessori) ??
            [],
          assicurazione: selectedBike.assicurazione?._id!,
        })),
        start: new Date(`${this.pickupDate}T${this.pickupTime}`),
        stop: new Date(`${this.dropoffDate}T${this.dropoffTime}`),
        pickupLocation: this.pickupLocation?._id!,
        dropLocation: this.dropoffLocation?._id!,
      };

      this.prenotazioneSrv
        .addPrenotazioneUnlogged(prenotazioneInput)
        .subscribe((prenotazione) => {
          // Salvo in localStorage con timestamp
          const expiresAt = Date.now() + 120 * 1000; // 120 secondi
          const data = {
            expiresAt,
            prenotazione: prenotazione._id,
          };
          localStorage.setItem('pendingPrenotazione', JSON.stringify(data));

          this.showAuthPopup = true;
        });
    } else {
      const prenotazioneInput: PrenotazioneInput = {
        idUser,
        bikes: this.selectedBikes.map((selectedBike) => ({
          id: selectedBike.id._id ?? '',
          quantity: 1,
          accessori:
            this.convertFromAccessoryGualtiToString(selectedBike.accessori) ??
            [],
          assicurazione: selectedBike.assicurazione?._id!,
        })),
        start: new Date(`${this.pickupDate}T${this.pickupTime}`),
        stop: new Date(`${this.dropoffDate}T${this.dropoffTime}`),
        pickupLocation: this.pickupLocation?._id!,
        dropLocation: this.dropoffLocation?._id!,
      };

      this.prenotazioneSrv
        .addPrenotazione(prenotazioneInput)
        .subscribe((prenotazione) => {
          localStorage.removeItem('pendingPrenotazione');
          this.showSuccessPopup = true;
        });
    }
  }

  // UTILS
  private convertFromAccessoryGualtiToString(
    accessories: AccessoryGualti[]
  ): string[] {
    return accessories.map((accessory) => {
      return accessory._id;
    });
  }

  private calcolaOreNoleggioMezzeGiornate8_18(start: Date, stop: Date): number {
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const MEZZA_GIORNATA_ORE = 4;

    let totaleOre = 0;

    const startDateOnly = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );
    const stopDateOnly = new Date(
      stop.getFullYear(),
      stop.getMonth(),
      stop.getDate()
    );

    const giorniTotali =
      Math.floor(
        (stopDateOnly.getTime() - startDateOnly.getTime()) / MS_PER_DAY
      ) + 1;

    for (let i = 0; i < giorniTotali; i++) {
      const giorno = new Date(startDateOnly.getTime() + i * MS_PER_DAY);

      const giornoInizio = new Date(
        giorno.getFullYear(),
        giorno.getMonth(),
        giorno.getDate(),
        8,
        0,
        0
      );
      const giornoFine = new Date(
        giorno.getFullYear(),
        giorno.getMonth(),
        giorno.getDate(),
        18,
        0,
        0
      );

      const periodoInizio = start > giornoInizio ? start : giornoInizio;
      const periodoFine = stop < giornoFine ? stop : giornoFine;

      const durataMS = periodoFine.getTime() - periodoInizio.getTime();

      if (durataMS > 0) {
        const durataOre = durataMS / (1000 * 60 * 60);
        const mezzeGiornate = durataOre <= MEZZA_GIORNATA_ORE ? 1 : 2;
        totaleOre += mezzeGiornate * MEZZA_GIORNATA_ORE;
      }
    }

    return totaleOre;
  }
}

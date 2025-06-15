import { Component, OnInit } from '@angular/core';
import { Bike, BikeService } from '../../services/bike.service';
import { Store, StoreService } from '../../services/store.service';
import { Accessory, AccessoryService } from '../../services/accessory.service';
import { Insurance, InsuranceService } from '../../services/insurance.service';
import { PrenotazioneInput, PrenotazioneService } from '../../services/prenotazione.service';
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

    // Step 2
    selectedBikes: {
        bike: Bike;
        accessories?: string[];
        insurance?: string;
    }[] = [];
    accessories: Accessory[] = [];
    insurances: Insurance[] = [];
    bikeDisponibili: Bike[] = [];
    prenotazioneInput?: PrenotazioneInput
    showAuthPopup = true;

    constructor(protected bikeSrv: BikeService, protected storeSrv: StoreService, protected accessorySrv: AccessoryService, protected insuranceSrv: InsuranceService, protected prenotazioneSrv: PrenotazioneService, protected authSrv: AuthService) {
        this.generateHours();
    }

    // Generale

    ngOnInit(): void {
        this.storeSrv.getStores().subscribe(stores => {
            this.stores = stores;
        });
        this.accessorySrv.getAccessories().subscribe(accesories => {
            this.accessories = accesories
        })
        this.insuranceSrv.getInsurances().subscribe(insurances => {
            this.insurances = insurances
        })
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
            this.bikeSrv.getBikesDisponibili(start, end, this.pickupLocation?._id!).subscribe(bikes => {
                this.bikeDisponibili = bikes;
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
        if (!this.pickupDate || !this.dropoffDate || !this.pickupTime || !this.dropoffTime) {
            this.invalidDateRange = false;
            return;
        }

        const start = new Date(`${this.pickupDate}T${this.pickupTime}`);
        const end = new Date(`${this.dropoffDate}T${this.dropoffTime}`);
        this.invalidDateRange = end <= start;
    }

    // STEP 2

    addBike(bike: Bike) {
    this.selectedBikes.push({ bike });
    }

    removeBike(index: number) {
        this.selectedBikes.splice(index, 1);
    }

    getAccessoriesTotalPrice(accessoryIds: string[]): number {
    if (!accessoryIds || !Array.isArray(accessoryIds)) return 0;
    return accessoryIds
        .map(id => this.accessories.find(a => a._id === id)?.prezzo || 0)
        .reduce((sum, price) => sum + price, 0);
    }

    getInsurancePrice(insuranceId: string) {
        const insurance = this.insurances.find(insurance => insurance._id === insuranceId);
        return insurance ? insurance.prezzo : 0;
    }

    getBikeTotalPrice(selectedBike: any): number {
    const bikePricePerHour = selectedBike?.bike?.idModello?.prezzo || 0;
    const accessoriesPrice = this.getAccessoriesTotalPrice(selectedBike.accessories);
    const insurancePrice = this.getInsurancePrice(selectedBike.insurance) || 0;

    // Calcolo ore totali di prenotazione
    const start = new Date(`${this.pickupDate}T${this.pickupTime}`);
    const end = new Date(`${this.dropoffDate}T${this.dropoffTime}`);
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.max(Math.ceil(diffMs / (1000 * 60 * 60)), 1);

    const bikeTotal = bikePricePerHour * hours;
    return bikeTotal + accessoriesPrice + insurancePrice;
    }

    confirmGoBack() {
        if (this.currentStep == 1) return;
        const conferma = window.confirm('Attenzione: se torni indietro perderai i dati di questa sezione. Continuare?');
        if (conferma) {
            this.goToStep(1);
        }
    }

    prenota() {
        console.log(this.selectedBikes);
        // if authenticated save id
        var idUser: string | undefined;
        if (this.authSrv.isLoggedIn()) {
            this.authSrv.currentUser$.subscribe(user => idUser =user?.id);
        }

        if (!idUser) {
            const prenotazioneInput: PrenotazioneInput = {
                bikes: this.selectedBikes.map(selectedBike => ({
                    id: selectedBike.bike._id ?? '',
                    quantity: 1,
                    accessori: selectedBike.accessories ?? [],
                    assicurazione: selectedBike.insurance
                })),
                start: new Date(`${this.pickupDate}T${this.pickupTime}`),
                stop: new Date(`${this.dropoffDate}T${this.dropoffTime}`),
                pickupLocation: this.pickupLocation?._id!,
                dropLocation: this.dropoffLocation?._id!
            };
            this.prenotazioneSrv.addPrenotazioneUnlogged(prenotazioneInput).subscribe(prenotazione => {
                this.showAuthPopup = true;
            });
        }

        
    }
}

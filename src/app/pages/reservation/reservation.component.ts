import { Component, OnInit } from '@angular/core';
import { Bike, BikeService } from '../../services/bike.service';
import { Store, StoreService } from '../../services/store.service';
import { Accessory, AccessoryService } from '../../services/accessory.service';
import { Insurance, InsuranceService } from '../../services/insurance.service';

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
        accessory?: string;
        insurance?: string;
    }[] = [];
    accessories: Accessory[] = [];
    insurances: Insurance[] = [];
    bikeDisponibili: Bike[] = [];

    constructor(protected bikeSrv: BikeService, protected storeSrv: StoreService, protected accessorySrv: AccessoryService, protected insuranceSrv: InsuranceService) {
        this.generateHours();
    }

    ngOnInit(): void {
        this.storeSrv.getStores().subscribe(stores => {
            this.stores = stores;
        });
        this.accessorySrv.getAccessories().subscribe(accesories => {
            this.accessories = accesories
        })
    }

    generateHours() {
        for (let i = 0; i < 24; i++) {
            const hour = i.toString().padStart(2, '0');
            this.hours.push(`${hour}:00`);
        }
    }

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

    addBike(bike: Bike) {
    this.selectedBikes.push({ bike });
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

    confirmGoBack() {
        if (this.currentStep == 1) return;
        const conferma = window.confirm('Attenzione: se torni indietro perderai i dati di questa sezione. Continuare?');
        if (conferma) {
            this.goToStep(1);
        }
    }
}

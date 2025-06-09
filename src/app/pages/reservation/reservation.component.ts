import { Component } from '@angular/core';

@Component({
    selector: 'app-reservation',
    templateUrl: './reservation.component.html',
    styleUrls: ['./reservation.component.scss', '../../app.component.scss'],
})
export class ReservationComponent {
    currentStep = 1;

    // Step 1
    locations = ['Milano Centrale', 'Roma Termini', 'Napoli Centrale'];
    pickupLocation = '';
    dropoffLocation = '';
    pickupDate: string = '';
    dropoffDate: string = '';
    pickupTime: string = '09:00';
    dropoffTime: string = '10:00';
    hours: string[] = [];
    invalidDateRange = false;

    // Step 2
    bikeImageUrl = '../../assets/images/bike1.jpg';
    bikeModel = 'Trek Marlin 5';
    bikeSize = 'M';
    insuranceSelected = true;
    accessories = ['Casco', 'Luci LED'];
    totalPrice = 56.00;

    constructor() {
        this.generateHours();
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

    goToStep(step: number) {
        if (this.invalidDateRange) return; // blocca il passaggio
        this.currentStep = step;
    }

    confirmGoBack() {
        const conferma = window.confirm('Attenzione: se torni indietro perderai i dati di questa sezione. Continuare?');
        if (conferma) {
            this.goToStep(1);
        }
    }
}

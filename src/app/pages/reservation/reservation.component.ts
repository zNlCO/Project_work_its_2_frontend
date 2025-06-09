import { Component } from '@angular/core';

@Component({
    selector: 'app-reservation',
    templateUrl: './reservation.component.html',
    styleUrls: ['./reservation.component.scss', '../../app.component.scss'],
})
export class ReservationComponent {
    currentStep = 1;

    pickupLocation = '';
    dropoffLocation = '';
    pickupDate: string = '';
    dropoffDate: string = '';

    autoFillDropoff() {
        if (!this.dropoffLocation || this.dropoffLocation === this.previousPickupLocation) {
            this.dropoffLocation = this.pickupLocation;
        }
        this.previousPickupLocation = this.pickupLocation;
    }

    private previousPickupLocation = '';

    goToStep(step: number) {
        this.currentStep = step;
    }

}

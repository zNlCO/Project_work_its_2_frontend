import { Component } from '@angular/core';

interface Bike {
    img: string;
    title: string;
    desc: string;
    price: number;
}

@Component({
    selector: 'app-bike-list',
    templateUrl: './bike-list.component.html',
    styleUrls: ['./bike-list.component.scss', '../../app.component.scss']
})
export class BikeListComponent {
    bikes: Bike[] = [
        { img: '../../../assets/images/bike1.jpg', title: 'Bici di Amine', desc: 'Perfetta per le strade venete.', price: 18 },
        { img: '../../../assets/images/bike2.jpg', title: 'MTB Hardtail', desc: 'Pronta per i colli Berici.', price: 22 },
        { img: '../../../assets/images/bike3.jpg', title: 'E-Bike', desc: 'Assistenza elettrica inclusa.', price: 28 },
        { img: '../../../assets/images/bike4.avif', title: 'E-Bike', desc: 'Assistenza elettrica inclusa.', price: 18 }
    ];

    currentIndex = 0;
    visibleCount = 3;

    get visibleBikes() {
        return this.bikes.slice(this.currentIndex, this.currentIndex + this.visibleCount);
    }

    prev() {
        if (this.currentIndex > 0) this.currentIndex--;
    }

    next() {
        if (this.currentIndex < this.bikes.length - this.visibleCount) this.currentIndex++;
    }
}
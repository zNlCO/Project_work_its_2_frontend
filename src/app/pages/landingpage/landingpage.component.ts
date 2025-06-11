import { Component, OnInit } from '@angular/core';
import { Store, StoreService } from '../../services/store.service';

@Component({
    selector: 'app-landingpage',
    templateUrl: './landingpage.component.html',
    styleUrls: ['./landingpage.component.scss', '../../app.component.scss'],
})
export class LandingpageComponent implements OnInit {
    stores: Store[] = [];

    constructor(protected storeSrv: StoreService) { }
    ngOnInit(): void {
        this.storeSrv.getStores().subscribe(stores => {
            this.stores = stores;
        });
    }
}

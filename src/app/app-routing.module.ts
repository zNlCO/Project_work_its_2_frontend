import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';
import { BackofficeHomeComponent } from './pages/backoffice-home/backoffice-home.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { LoginComponent } from './pages/login/login.component';
import { PuntivenditaComponent } from './pages/puntivendita/puntivendita.component';
import { GestionebicicletteComponent } from './pages/gestionebiciclette/gestionebiciclette.component';
import { GestioneprezziComponent } from './pages/gestioneprezzi/gestioneprezzi.component';
import { GestioneprenotazioniComponent } from './pages/gestioneprenotazioni/gestioneprenotazioni.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'landingpage',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'landingpage',
        component: LandingpageComponent
    },
    {
        path: 'reservations',
        component: ReservationComponent
    },
    {
        path: 'backoffice-home',
        component: BackofficeHomeComponent
    },
    {
        path: 'puntivendita',
        component: PuntivenditaComponent
    },
    {
        path: 'gestionebiciclette',
        component: GestionebicicletteComponent

    },
    {
        path: 'gestioneprezzi',
        component: GestioneprezziComponent

    },
    {
        path: 'gestioneprenotazioni',
        component: GestioneprenotazioniComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

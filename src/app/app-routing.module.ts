import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';
import { BackofficeHomeComponent } from './pages/backoffice-home/backoffice-home.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { LoginComponent } from './pages/login/login.component';
import { GestionebicicletteComponent } from './pages/gestionebiciclette/gestionebiciclette.component';
import { GestioneprezziComponent } from './pages/gestioneprezzi/gestioneprezzi.component';
import { GestioneprenotazioniComponent } from './pages/gestioneprenotazioni/gestioneprenotazioni.component';
import { PaginaManutenzioniComponent } from './pages/pagina-manutenzioni/pagina-manutenzioni.component';
import { GestioneOperatoriComponent } from './pages/gestione-operatori/gestione-operatori.component';
import { RegisterComponent } from './pages/register/register.component';
import { ActivateComponent } from './pages/activate/activate.component';
import { MainComponent } from './pages/main/main.component';
import { BackofficeComponent } from './pages/backoffice/backoffice.component';
import { PuntivenditaComponent } from './pages/puntivendita/puntivendita.component';
import { MyReservationsComponent } from './pages/my-reservations/my-reservations.component';
import { authOperatorGuard } from './guards/auth-operator.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'activate',
    component: ActivateComponent,
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'home',
        component: LandingpageComponent,
      },
      {
        path: 'reservation',
        component: ReservationComponent,
      },
      {
        path: 'my-reservations',
        component: MyReservationsComponent,
      },
    ],
  },
  {
    path: 'backoffice',
    component: BackofficeComponent,
    children: [
      {
        path: 'home',
        component: BackofficeHomeComponent,
      },
      {
        path: 'puntivendita',
        component: PuntivenditaComponent,
      },
      {
        path: 'gestionebiciclette',
        component: GestionebicicletteComponent,
      },
      {
        path: 'gestioneprezzi',
        component: GestioneprezziComponent,
      },
      {
        path: 'gestioneprenotazioni',
        component: GestioneprenotazioniComponent,
      },
      {
        path: 'pagina-manutenzioni',
        component: PaginaManutenzioniComponent,
      },
      {
        path: 'gestione-operatori',
        component: GestioneOperatoriComponent,
      },
    ],
    canActivate: [authOperatorGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

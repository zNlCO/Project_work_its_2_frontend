import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';
import { BackofficeHomeComponent } from './pages/backoffice-home/backoffice-home.component';
import { PuntivenditaComponent } from './pages/puntivendita/puntivendita.component';
import { GestionebicicletteComponent } from './pages/gestionebiciclette/gestionebiciclette.component';
import { GestioneprezziComponent } from './pages/gestioneprezzi/gestioneprezzi.component';
import { GestioneprenotazioniComponent } from './pages/gestioneprenotazioni/gestioneprenotazioni.component';

const routes: Routes = [
    {
        path: 'landingpage',
        component: LandingpageComponent
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
      path:'gestioneprenotazioni',
      component: GestioneprenotazioniComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

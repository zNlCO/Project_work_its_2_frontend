import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { AuthInterceptor } from './utils/auth.interceptor';
import { LandingpageComponent } from './pages/landingpage/landingpage.component';
import { BackofficeHomeComponent } from './pages/backoffice-home/backoffice-home.component';
import { BikeListComponent } from './components/bike-list/bike-list.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { PuntivenditaComponent } from './pages/puntivendita/puntivendita.component';
import { GestionebicicletteComponent } from './pages/gestionebiciclette/gestionebiciclette.component';
import { GestioneprezziComponent } from './pages/gestioneprezzi/gestioneprezzi.component';
import { GestioneprenotazioniComponent } from './pages/gestioneprenotazioni/gestioneprenotazioni.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        LandingpageComponent,
        BackofficeHomeComponent,
        BikeListComponent,
        ReservationComponent,
        PuntivenditaComponent,
        GestionebicicletteComponent,
        GestioneprezziComponent,
        GestioneprenotazioniComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, provideClientHydration()
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

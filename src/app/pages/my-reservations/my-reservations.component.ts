import { Component, OnInit } from '@angular/core';
import { PrenotazioneService } from '../../services/prenotazione.service';
import { Prenotazione,PrenotazioneGualti } from '../../services/prenotazione.service'; // assicurati che il tipo sia importato correttamente

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.scss']
})
export class MyReservationsComponent implements OnInit {
    myReservations: PrenotazioneGualti[] = [];

  constructor(private prenotazioneService: PrenotazioneService) {}

  ngOnInit(): void {
    this.prenotazioneService.getUserPrenotazioni().subscribe({
      next: (data) => this.myReservations = data,
      error: (err) => console.error('Errore nel recupero delle prenotazioni:', err)
    });
  }
}

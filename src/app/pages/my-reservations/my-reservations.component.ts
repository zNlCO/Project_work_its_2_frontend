import { Component, OnInit } from '@angular/core';
import { PrenotazioneService } from '../../services/prenotazione.service';
import { Prenotazione, PrenotazioneGualti } from '../../services/prenotazione.service'; // assicurati che il tipo sia importato correttamente

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.scss']
})
export class MyReservationsComponent implements OnInit {
    myReservations: PrenotazioneGualti[] = [];

  constructor(private prenotazioneService: PrenotazioneService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    console.log('Loading reservations...');
    this.prenotazioneService.getUserPrenotazioni().subscribe({
      next: (data) => {
        console.log('Reservations loaded:', data);
        // Update status based on cancelled field
        this.myReservations = data.map(reservation => ({
          ...reservation,
          status: reservation.cancelled ? 'Cancellato' : reservation.status
        }));
      },
      error: (err) => {
        console.error('Errore nel recupero delle prenotazioni:', err);
      }
    });
  }

  cancelReservation(id: string): void {
    console.log('Attempting to cancel reservation:', id);
    if (!id) {
      console.error('ID della prenotazione non valido');
      return;
    }

    if (confirm('Sei sicuro di voler cancellare questa prenotazione?')) {
      console.log('User confirmed cancellation');
      this.prenotazioneService.deletePrenotazione(id).subscribe({
        next: (response) => {
          console.log('Server response:', response);
          console.log('Response status:', response.status);
          console.log('Response cancelled:', response.cancelled);
          
          // Update the reservation in the local array
          const index = this.myReservations.findIndex(r => r._id === id);
          if (index !== -1) {
            // Update both cancelled and status
            this.myReservations[index] = {
              ...this.myReservations[index],
              cancelled: true,
              status: 'Cancellato'
            };
            
            // Force a reload after a short delay to ensure data consistency
            setTimeout(() => {
              console.log('Reloading reservations...');
              this.loadReservations();
            }, 1000);
          }
        },
        error: (err) => {
          console.error('Errore durante la cancellazione:', err);
          console.error('Error details:', err);
          alert('Si è verificato un errore durante la cancellazione della prenotazione. Riprova più tardi.');
        }
      });
    } else {
      console.log('User cancelled the operation');
    }
  }
}

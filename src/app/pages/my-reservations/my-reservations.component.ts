import { Component } from '@angular/core';
import { Prenotazione } from '../../services/prenotazione.service';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.scss'
})
export class MyReservationsComponent {
myReservations: Prenotazione[] = [
    {
        id: '1',
        idUser: 'Mario Rossi',
        pickupLocation: {
            _id: 'id1u3o478839',
            location: 'Via Roma 1'
        },
        dropLocation: {
            _id: 'id1u3o478839',
            location: 'Verona via diotoscano'
        },
        start: new Date('2025-06-15'),
        stop:  new Date('2025-06-16'),
        bikes: [
            {
                bike: {
                    idModello: {
                        _id: 'id1u3o478839',
                        descrizione: 'descrizione',
                        type: 'bici',
                        size: 'L',
                        elettrica: true,
                        prezzo: 10,
                        imgUrl: 'https://rideclone.onrender.com/assets/images/bike1.jpg'
                    },
                    quantity: 1,
                    idPuntoVendita: ''
                },
                accessori: ['a1'],
                assicurazione: 'i1'

            }
        ],
        manutenzione: false,
        cancelled: false,
        status: 'confermata'
    },
    {
        id: '1',
        idUser: 'Pippo cocaina',
        pickupLocation: {
            _id: 'id1u3o478839',
            location: 'Via Roma 1'
        },
        dropLocation: {
            _id: 'id1u3o478839',
            location: 'Verona via diotoscano'
        },
        start: new Date('2025-06-15'),
        stop:  new Date('2025-06-16'),
        bikes: [
            {
                bike: {
                    idModello: {
                        _id: 'id1u3o478839',
                        descrizione: 'descrizione',
                        type: 'bici',
                        size: 'L',
                        elettrica: true,
                        prezzo: 10,
                        imgUrl: 'https://rideclone.onrender.com/assets/images/bike1.jpg'
                    },
                    quantity: 1,
                    idPuntoVendita: ''
                },
                accessori: ['a1'],
                assicurazione: 'i1'

            }
        ],
        manutenzione: false,
        cancelled: false,
        status: 'confermata'
    },    {
        id: '1',
        idUser: 'Giuseppe Verdi',
        pickupLocation: {
            _id: 'id1u3o478839',
            location: 'Via Roma 1'
        },
        dropLocation: {
            _id: 'id1u3o478839',
            location: 'Verona via diotoscano'
        },
        start: new Date('2025-06-15'),
        stop:  new Date('2025-06-16'),
        bikes: [
            {
                bike: {
                    idModello: {
                        _id: 'id1u3o478839',
                        descrizione: 'descrizione',
                        type: 'bici',
                        size: 'L',
                        elettrica: true,
                        prezzo: 10,
                        imgUrl: 'https://rideclone.onrender.com/assets/images/bike1.jpg',
                    },
                    quantity: 1,
                    idPuntoVendita: ''
                },
                accessori: ['a1'],
                assicurazione: 'i1'

            }
        ],
        manutenzione: false,
        cancelled: false,
        status: 'confermata'
    }
];
}
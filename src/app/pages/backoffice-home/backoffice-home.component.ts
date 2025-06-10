import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';

// Registra tutti i componenti di Chart.js (controller, scale, ecc.)
Chart.register(...registerables);

@Component({
  selector: 'app-backoffice-home',
  templateUrl: './backoffice-home.component.html',
  styleUrls: ['./backoffice-home.component.scss', '../../app.component.scss']
})
export class BackofficeHomeComponent implements AfterViewInit {

  // Dati per le card delle statistiche chiave (ora sono dinamici)
  prenotazioniMeseCorrente: number = 125;
  ricavoMeseCorrente: number = 3450;
  biciNoleggiate: number = 78;
  biciInManutenzione: number = 3;

  // Riferimenti ai tag <canvas> nel template HTML
  @ViewChild('prenotazioniChart') private prenotazioniChartRef!: ElementRef;
  @ViewChild('ricaviChart') private ricaviChartRef!: ElementRef;

  constructor() { }

  // Usiamo ngAfterViewInit per essere sicuri che i <canvas> siano già nel DOM
  ngAfterViewInit(): void {
    this.createPrenotazioniChart();
    this.createRicaviChart();
  }

  /**
   * Genera le etichette per gli ultimi 6 mesi partendo dal mese corrente.
   */
  private getLastSixMonthsLabels(): string[] {
    const months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    const labels: string[] = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      labels.push(months[d.getMonth()]);
    }
    return labels;
  }

  /**
   * Crea il grafico a barre per le prenotazioni mensili.
   */
  private createPrenotazioniChart(): void {
    const labels = this.getLastSixMonthsLabels();
    const data = {
      labels: labels,
      datasets: [{
        label: 'Numero di Prenotazioni',
        data: [65, 59, 80, 81, 95, 125], // Dati di esempio
        backgroundColor: 'rgba(0, 170, 255, 0.6)',
        borderColor: 'rgba(0, 170, 255, 1)',
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: 'rgba(0, 170, 255, 0.8)'
      }]
    };

    new Chart(this.prenotazioniChartRef.nativeElement, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // Nascondiamo la legenda per un look più pulito
          },
          tooltip: {
            backgroundColor: '#2a2a2a',
            titleColor: '#e0e0e0',
            bodyColor: '#e0e0e0',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#a0a0a0' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          x: {
            ticks: { color: '#a0a0a0' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          }
        }
      }
    });
  }

  /**
   * Crea il grafico a linee per i ricavi mensili.
   */
  private createRicaviChart(): void {
    const labels = this.getLastSixMonthsLabels();
    const data = {
      labels: labels,
      datasets: [{
        label: 'Ricavi Mensili (€)',
        data: [1800, 1950, 2500, 2200, 2800, 3450], // Dati di esempio
        fill: true,
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
        borderColor: '#28a745',
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#28a745',
        pointHoverBackgroundColor: '#28a745',
        pointHoverBorderColor: '#ffffff',
        tension: 0.4 // Per linee più morbide
      }]
    };

    new Chart(this.ricaviChartRef.nativeElement, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
         plugins: {
          legend: {
            display: false
          },
           tooltip: {
            backgroundColor: '#2a2a2a',
            titleColor: '#e0e0e0',
            bodyColor: '#e0e0e0',
          }
        },
        scales: {
           y: {
            beginAtZero: true,
            ticks: { 
                color: '#a0a0a0',
                callback: (value) => `€ ${value}` // Aggiunge il simbolo dell'euro
            },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          x: {
            ticks: { color: '#a0a0a0' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          }
        }
      }
    });
  }
}
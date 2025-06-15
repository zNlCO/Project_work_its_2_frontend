import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { PrenotazioneService } from '../../services/prenotazione.service';

// Registra tutti i componenti di Chart.js (controller, scale, ecc.)
Chart.register(...registerables);

@Component({
  selector: 'app-backoffice-home',
  templateUrl: './backoffice-home.component.html',
  styleUrls: ['./backoffice-home.component.scss', '../../app.component.scss']
})
export class BackofficeHomeComponent implements AfterViewInit, OnInit {

  // Dati per le card delle statistiche chiave (solo mese corrente)
  prenotazioniMeseCorrente: number = 0;
  ricavoMeseCorrente: number = 0;
  biciNoleggiate: number = 0;
  biciInManutenzione: number = 0;

  // Riferimenti ai tag <canvas> nel template HTML
  @ViewChild('prenotazioniChart') private prenotazioniChartRef!: ElementRef;
  @ViewChild('ricaviChart') private ricaviChartRef!: ElementRef;

  constructor(private prenotazioneService: PrenotazioneService) { }

  ngOnInit(): void {
    this.loadAnalytics();
  }

  private loadAnalytics(): void {
    this.prenotazioneService.getAnalytics().subscribe({
      next: (analytics) => {
        // Aggiorna solo i dati del mese corrente per le card
        this.prenotazioniMeseCorrente = analytics.prenotazioniMeseCorrente;
        this.ricavoMeseCorrente = analytics.ricaviMeseCorrente;
        this.biciNoleggiate = analytics.biciInNoleggio;
        this.biciInManutenzione = analytics.biciInManutenzione;

        // Aggiorna i grafici con i dati degli ultimi 6 mesi
        this.updateCharts(analytics);
      },
      error: (error) => {
        console.error('Error loading analytics:', error);
      }
    });
  }

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
    const currentMonth = today.getMonth();

    // Partiamo dal mese corrente e andiamo indietro di 5 mesi
    for (let i = 0; i < 6; i++) {
      const monthIndex = (currentMonth - i + 12) % 12; // +12 per gestire i mesi negativi
      labels.unshift(months[monthIndex]); // unshift per avere l'ordine cronologico corretto
    }
    return labels;
  }

  private updateCharts(analytics: any): void {
    // Aggiorna il grafico delle prenotazioni
    const prenotazioniChart = Chart.getChart(this.prenotazioniChartRef.nativeElement);
    if (prenotazioniChart) {
      prenotazioniChart.data.datasets[0].data = analytics.prenotazioniUltimi6Mesi;
      prenotazioniChart.update();
    }

    // Aggiorna il grafico dei ricavi
    const ricaviChart = Chart.getChart(this.ricaviChartRef.nativeElement);
    if (ricaviChart) {
      ricaviChart.data.datasets[0].data = analytics.ricaviUltimi6Mesi;
      ricaviChart.update();
    }
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
        data: [0, 0, 0, 0, 0, 0], // Placeholder data, will be updated when analytics are loaded
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
        data: [0, 0, 0, 0, 0, 0], // Placeholder data, will be updated when analytics are loaded
        fill: true,
        backgroundColor: 'rgba(40, 167, 69, 0.2)',
        borderColor: '#28a745',
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#28a745',
        pointHoverBackgroundColor: '#28a745',
        pointHoverBorderColor: '#ffffff',
        tension: 0.4
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
              callback: (value) => `€ ${value}`
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
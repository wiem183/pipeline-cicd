import { Component, OnInit } from '@angular/core';
import { QuoiTester } from 'src/app/models/quoi-tester.model';
import { QuoiTesterService } from 'src/app/services/quoi-tester.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PptxGenJS from 'pptxgenjs';
import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-soft-de-test',
  templateUrl: './soft-de-test.component.html',
  styleUrls: ['./soft-de-test.component.css']
})
export class SoftDeTestComponent implements OnInit {
  data: QuoiTester[] = [];
  filteredData: QuoiTester[] = [];
  selectedProject = '';
  selectedFamille = '';
  
  // Données pour les graphiques
  statusChart: Chart | undefined;
  familleChart: Chart | undefined;
  projectChart: Chart | undefined;
  
  // Options pour les sélecteurs
  projetOptions: string[] = [];
  familleOptions: string[] = [];
  
  // Statistiques
  stats = {
    total: 0,
    disponible: 0,
    nonSupporte: 0,
    enAttente: 0,
    nonVerifie: 0
  };

  constructor(private quoiTesterService: QuoiTesterService) {}

ngOnInit(): void {
  this.quoiTesterService.getAll().subscribe(res => {
    this.data = res;
    this.projetOptions = [...new Set(this.data.map(d => d.projet).filter(Boolean))];
    this.familleOptions = [...new Set(this.data.map(d => d.familleTechnique).filter(Boolean))];
    this.applyFilters(); // 🟢 charge tout de suite avec filtres vides = tout
  });
}

applyFilters() {
  // 🟢 Filtrer proprement
  this.filteredData = this.data.filter(item =>
    (!this.selectedProject || item.projet === this.selectedProject) &&
    (!this.selectedFamille || item.familleTechnique === this.selectedFamille)
  );

  // 🟢 Recalculer les stats correctes basées sur filteredData
  this.updateStats();

  // 🟢 Recharger les graphiques
  this.updateCharts();
}

updateStats() {
  const total = this.filteredData.length;
  let disponible = 0, nonSupporte = 0, enAttente = 0, nonVerifie = 0;

  for (const d of this.filteredData) {
    const etat = this.getEtatAffichage(d).label;
    if (etat === 'OK') disponible++;
    else if (etat === 'NOT OK') nonSupporte++;
    else if (etat === 'N/A') enAttente++;
    else nonVerifie++;
  }

  this.stats = {
    total: total,
    disponible: disponible,
    nonSupporte: nonSupporte,
    enAttente: enAttente,
    nonVerifie: nonVerifie
  };
}


  loadData() {
    this.quoiTesterService.getAll().subscribe(res => {
      this.data = res;
      this.filteredData = [...this.data];
      this.projetOptions = [...new Set(this.data.map(d => d.projet).filter(Boolean))];
      this.familleOptions = [...new Set(this.data.map(d => d.familleTechnique).filter(Boolean))];
      this.updateStats();
      this.initCharts();
    });
  }




  getEtatAffichage(q: QuoiTester): { icon: string, label: string, color: string } {
    const commentaire = q.commentaire?.toLowerCase() || '';
    const soft = q.softDeTest?.toLowerCase() || '';

    if (commentaire.includes("fonction n'est pas supportée par le soft")) {
      return { icon: '❌', label: 'NOT OK', color: '#ef4444' };
    } else if (commentaire.includes('gigs de test ne sont pas disponible')) {
      return { icon: '⏳', label: 'N/A', color: '#f59e0b' };
    } else if (commentaire === 'pas de commentaire') {
      return soft === 'oui' 
        ? { icon: '✅', label: 'OK', color: '#10b981' } 
        : { icon: '❓', label: 'N/A', color: '#64748b' };
    }
    return { icon: '🔍', label: 'À analyser', color: '#6366f1' };
  }

  get pourcentageSoft(): number {
    return this.stats.total ? (this.stats.disponible / this.stats.total) * 100 : 0;
  }

  initCharts() {
    this.createStatusChart();
    this.createFamilleChart();
    this.createProjectChart();
  }

  updateCharts() {
    if (this.statusChart) this.statusChart.destroy();
    if (this.familleChart) this.familleChart.destroy();
    if (this.projectChart) this.projectChart.destroy();
    
    this.initCharts();
  }

  createStatusChart() {
    const ctx = document.getElementById('statusChart') as HTMLCanvasElement;
    const data: ChartData = {
      labels: ['Disponible', 'Non supporté', 'En attente', 'Non vérifié', 'À analyser'],
      datasets: [{
        data: [
          this.stats.disponible,
          this.stats.nonSupporte,
          this.stats.enAttente,
          this.stats.nonVerifie,
          this.filteredData.length - (this.stats.disponible + this.stats.nonSupporte + this.stats.enAttente + this.stats.nonVerifie)
        ],
        backgroundColor: [
          '#10b981',
          '#ef4444',
          '#f59e0b',
          '#64748b',
          '#6366f1'
        ],
        borderWidth: 1
      }]
    };

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw as number;
                const total = context.dataset.data.reduce((a, b) => (a as number) + (b as number), 0) as number;
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    this.statusChart = new Chart(ctx, config);
  }

  createFamilleChart() {
    const familles = [...new Set(this.filteredData.map(d => d.familleTechnique).filter(Boolean))];
    const counts = familles.map(famille => 
      this.filteredData.filter(d => d.familleTechnique === famille).length
    );

    const ctx = document.getElementById('familleChart') as HTMLCanvasElement;
    const data: ChartData = {
      labels: familles,
      datasets: [{
        label: 'Fonctions par famille',
        data: counts,
        backgroundColor: '#3b82f6',
        borderColor: '#1d4ed8',
        borderWidth: 1
      }]
    };

    const config: ChartConfiguration = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Nombre de fonctions'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Famille technique'
            }
          }
        }
      }
    };

    this.familleChart = new Chart(ctx, config);
  }

  createProjectChart() {
    const projets = [...new Set(this.filteredData.map(d => d.projet).filter(Boolean))];
    const statuses = ['OK', 'NOT OK', 'N/A'];
    
    const datasets = statuses.map(status => {
      return {
        label: status,
        data: projets.map(projet => 
          this.filteredData.filter(d => 
            d.projet === projet && this.getEtatAffichage(d).label === status
          ).length
        ),
        backgroundColor: 
          status === 'OK' ? '#10b981' : 
          status === 'NOT OK' ? '#ef4444' : '#f59e0b'
      };
    });

    const ctx = document.getElementById('projectChart') as HTMLCanvasElement;
    const data: ChartData = {
      labels: projets,
      datasets: datasets
    };

    const config: ChartConfiguration = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            stacked: true,
            title: {
              display: true,
              text: 'Nombre de fonctions'
            }
          },
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Projet'
            }
          }
        }
      }
    };

    this.projectChart = new Chart(ctx, config);
  }

  downloadPDF() {
    const element = document.querySelector('.dashboard-container') as HTMLElement;
    const options = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true
    };

    html2canvas(element, options).then(canvas => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('rapport-soft-de-test.pdf');
    });
  }

  downloadPPT() {
    const pptx = new PptxGenJS();
    
    // Slide de titre
    const titleSlide = pptx.addSlide();
    titleSlide.addText('Rapport Soft de Test', { 
      x: 0.5, y: 0.5, w: '90%', h: 1.5, 
      fontSize: 36, bold: true, color: '3B82F6', align: 'center' 
    });
    titleSlide.addText(`Généré le ${new Date().toLocaleDateString()}`, {
      x: 0.5, y: 2, w: '90%', h: 0.5,
      fontSize: 14, color: '64748B', align: 'center'
    });

    // Slide de statistiques
    const statsSlide = pptx.addSlide();
    statsSlide.addText('Statistiques Globales', { 
      x: 0.5, y: 0.5, fontSize: 24, bold: true, color: '3B82F6' 
    });
    
    const statsData = [
      { label: 'Fonctions totales', value: this.stats.total },
      { label: 'Disponible', value: this.stats.disponible },
      { label: 'Non supporté', value: this.stats.nonSupporte },
      { label: 'En attente', value: this.stats.enAttente },
      { label: 'Non vérifié', value: this.stats.nonVerifie }
    ];
    
    statsSlide.addText(statsData.map(stat => 
      `${stat.label}: ${stat.value} (${Math.round((stat.value / this.stats.total) * 100)}%)`
    ).join('\n'), { x: 0.5, y: 1.5, fontSize: 14 });

    // Slide de graphique
    const chartSlide = pptx.addSlide();
    chartSlide.addText('Répartition par statut', { 
      x: 0.5, y: 0.5, fontSize: 24, bold: true, color: '3B82F6' 
    });
    
    // Pour un vrai export PPT avec graphiques, il faudrait exporter les canvas des graphiques
    // et les ajouter comme images (plus complexe à implémenter)
    
    pptx.writeFile({ fileName: 'rapport-soft-de-test.pptx' });
  }
}
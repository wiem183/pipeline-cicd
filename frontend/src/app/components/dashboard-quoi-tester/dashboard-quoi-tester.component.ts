import { Component, OnInit } from '@angular/core';
import { QuoiTesterService } from 'src/app/services/quoi-tester.service';
import { QuoiTester } from 'src/app/models/quoi-tester.model';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import {
  Chart,
  ChartConfiguration,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

@Component({
  selector: 'app-dashboard-quoi-tester',
  templateUrl: './dashboard-quoi-tester.component.html',
  styleUrls: ['./dashboard-quoi-tester.component.css']
})
export class DashboardQuoiTesterComponent implements OnInit {
  tests: QuoiTester[] = [];

  selectedProjet: string = '';
  selectedEtat: string = '';
  selectedRun: string = '';
  versionText: string = '';

  donutChartInstance: Chart<'doughnut', number[], string> | null = null;
  barChartInstance: Chart<'bar', number[], string> | null = null;

  constructor(private quoiTesterService: QuoiTesterService) {}

  ngOnInit(): void {
    this.quoiTesterService.getAll().subscribe(data => {
      this.tests = data.filter(t => (t.demandeICP || '').toLowerCase().trim() === 'oui');
      this.updateChart();
      this.updateBarChart();
    });
  }
  
  getEtatFinal(test: QuoiTester): string {
    return (test.softDeTest || '').toLowerCase().trim() === 'oui' ? 'Supported' : 'Temporarily Not Supported';
  }

  get projets(): string[] {
    return Array.from(new Set(this.tests.map(t => t.projet).filter(Boolean)));
  }

  get filteredTests(): QuoiTester[] {
    return this.tests.filter(t => {
      const matchesProjet = this.selectedProjet ? t.projet === this.selectedProjet : true;
      const etat = this.getEtatFinal(t);
      const matchesEtat = this.selectedEtat ? etat === this.selectedEtat : true;
      return matchesProjet && matchesEtat;
    });
  }

  get totalSupported(): number {
    return this.filteredTests.filter(t => this.getEtatFinal(t) === 'Supported').length;
  }

  get totalTemporarilyNotSupported(): number {
    return this.filteredTests.filter(t => this.getEtatFinal(t) === 'Temporarily Not Supported').length;
  }

  updateChart(): void {
    const canvas = document.getElementById('donutChart') as HTMLCanvasElement;
    if (!canvas) return;

    const data = [this.totalSupported, this.totalTemporarilyNotSupported];
    const labels = ['Supported', 'Temporarily Not Supported'];

    if (this.donutChartInstance) {
      this.donutChartInstance.destroy();
    }

    const config: ChartConfiguration<'doughnut', number[], string> = {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          label: 'Statut des fonctions',
          data,
          backgroundColor: ['#1ABC9C', '#F39C12'],
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        cutout: '60%',
        radius: '80%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#2C3E50', font: { size: 14 } }
          },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.label} : ${ctx.parsed}`
            },
            backgroundColor: 'rgba(44, 62, 80, 0.9)',
            titleFont: { weight: 'bold' },
            bodyFont: { size: 14 }
          }
        }
      }
    };

    this.donutChartInstance = new Chart(canvas, config);
  }

  updateBarChart(): void {
    const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    if (!canvas) return;

    const grouped: { [famille: string]: number } = {};
    this.filteredTests.forEach(test => {
      if (!grouped[test.familleTechnique]) {
        grouped[test.familleTechnique] = 0;
      }
      grouped[test.familleTechnique]++;
    });

    const labels = Object.keys(grouped);
    const values = Object.values(grouped);

    // Ici baseColors est un tableau à étendre si besoin
    const baseColors = ['#1ABC9C'];
    // Pour avoir autant de couleurs que de labels, on peut répéter les couleurs (optionnel)
    const backgroundColors = labels.map((_, i) => baseColors[i % baseColors.length]);
    const hoverColors = backgroundColors.map(c => this.shadeColor(c, -15));

    if (this.barChartInstance) {
      this.barChartInstance.destroy();
    }

    this.barChartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Nombre de Fonctions Soft',
          data: values,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: hoverColors,
          borderRadius: 12,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.label} : ${ctx.parsed} fonction(s)`
            },
            backgroundColor: '#2C3E50',
            titleFont: { weight: 'bold' },
            bodyFont: { size: 13 },
            cornerRadius: 6,
            padding: 10
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Nombre de Fonctions',
              color: '#2C3E50',
              font: { weight: 'bold' }
            },
            ticks: { color: '#34495E' },
            grid: { color: '#ecf0f1' }
          },
          y: {
            title: {
              display: true,
              text: 'Famille Technique',
              color: '#2C3E50',
              font: { weight: 'bold' }
            },
            ticks: { color: '#34495E' },
            grid: { display: false }
          }
        }
      }
    });
  }

  shadeColor(color: string, percent: number): string {
    const f = parseInt(color.slice(1), 16),
          t = percent < 0 ? 0 : 255,
          p = Math.abs(percent) / 100;
    const R = f >> 16,
          G = (f >> 8) & 0x00FF,
          B = f & 0x0000FF;
    return `rgb(${Math.round((t - R) * p + R)},
                ${Math.round((t - G) * p + G)},
                ${Math.round((t - B) * p + B)})`;
  }

  onProjetChange(): void {
    this.updateChart();
    this.updateBarChart();
  }

  onEtatChange(): void {
    this.updateChart();
    this.updateBarChart();
  }

  downloadPDF(): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoPath = 'assets/images/home/logo.png';

    // ✅ Logo
    try {
      doc.addImage(logoPath, 'PNG', 14, 10, 30, 15);
    } catch {}

    // ✅ Titre principal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(41, 128, 185);
    doc.text('Rapport des Tests Fonctionnels', pageWidth / 2, 25, { align: 'center' });

    // ✅ Projet (plus visible)
    doc.setFontSize(13);
    doc.setTextColor(52, 73, 94);
    doc.setFont('helvetica', 'bold');
    const projetAffiche = this.selectedProjet ? this.selectedProjet.toUpperCase() : 'TOUS LES PROJETS';
    doc.text(`PROJET : ${projetAffiche}`, 14, 35);

    // ✅ Run
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(231, 76, 60); // Rouge
    doc.text('Run :', 14, 42);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(44, 62, 80);
    doc.text(`${this.selectedRun || 'Non spécifié'}`, 35, 42);

    // ✅ Version
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(39, 174, 96); // Vert
    doc.text('Version :', 14, 49);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(44, 62, 80);
    doc.text(`${this.versionText || 'Non spécifiée'}`, 40, 49);

    // ✅ Date
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text('Date :', 14, 56);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(44, 62, 80);
    doc.text(`${new Date().toLocaleDateString()}`, 34, 56);

    // ✅ Donut chart (image depuis canvas)
    const canvas = document.getElementById('donutChart') as HTMLCanvasElement;
    if (canvas) {
      const chartImage = canvas.toDataURL('image/png', 1.0);
      doc.addImage(chartImage, 'PNG', 20, 65, 80, 80); // x, y, w, h
    }

    // ✅ Statistiques à droite
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(44, 62, 80);
    doc.text('Statistiques des Fonctions Testées :', 110, 70);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(26, 188, 156); // Supported
    doc.text(`✔ Supported : ${this.totalSupported}`, 110, 80);

    doc.setTextColor(243, 156, 18); // Not supported
    doc.text(`✖ Temporarily Not Supported : ${this.totalTemporarilyNotSupported}`, 110, 90);

    // ✅ Tableau des tests
    const tableY = 150;
    const columns = ['Famille Technique', 'Fonctions à Tester', 'Statut', 'Commentaire'];
    const rows = this.filteredTests.map(t => [
      t.familleTechnique,
      t.fonctionsATester,
      this.getEtatFinal(t),
      t.commentaire || 'RAS'
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: tableY,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: [44, 62, 80],
        halign: 'left'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { horizontal: 10 },
      didDrawPage: () => {
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - 20, pageHeight - 10);
      }
    });

    doc.save(`rapport-tests-${this.selectedProjet || 'global'}.pdf`);
  }
}

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { QuoiTesterService } from 'src/app/services/quoi-tester.service';
import { QuoiTester } from 'src/app/models/quoi-tester.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Chart,
  ChartConfiguration,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-quoi-tester',
  templateUrl: './quoi-tester.component.html',
  styleUrls: ['./quoi-tester.component.css']
})
export class QuoiTesterComponent implements OnInit, AfterViewInit {
  tests: QuoiTester[] = [];
  donutChartInstance: Chart<'doughnut', number[], string> | null = null;

  selectedProjet: string = '';
  selectedRun: string = '';
  versionText: string = '';
  
  runs: string[] = Array.from({ length: 20 }, (_, i) => `Run ${i + 1}`);

  constructor(private quoiTesterService: QuoiTesterService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    if (this.tests.length) {
      this.initDonutChart();
    }
  }

  private loadData(): void {
    this.quoiTesterService.getAll().subscribe({
      next: (data) => {
        this.tests = data;
        setTimeout(() => this.initDonutChart(), 0);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
      }
    });
  }

  private isOui(value: string | undefined | null): boolean {
    return (value || '').trim().toLowerCase() === 'oui';
  }

  get testsOui(): QuoiTester[] {
    return this.tests.filter(t => this.isOui(t.demandeICP));
  }

  get projets(): string[] {
    const set = new Set<string>();
    for (const t of this.testsOui) {
      const projet = (t.projet || '').trim();
      if (projet) set.add(projet);
    }
    return Array.from(set).sort();
  }

  get filteredTests(): QuoiTester[] {
    return this.tests.filter(t =>
      this.isOui(t.demandeICP) &&
      (this.selectedProjet ? t.projet === this.selectedProjet : true)
    );
  }

  get repartitionParFamille(): { famille: string; count: number }[] {
    const counts = new Map<string, number>();
    for (const t of this.filteredTests) {
      const f = t.familleTechnique?.trim() || 'Non classé';
      counts.set(f, (counts.get(f) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([famille, count]) => ({ famille, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }

  get totalICP(): number {
    return this.filteredTests.length;
  }

  initDonutChart(): void {
    const canvas = document.getElementById('donutChart') as HTMLCanvasElement;
    if (!canvas || !this.repartitionParFamille.length) return;

    const labels = this.repartitionParFamille.map(r => r.famille);
    const data = this.repartitionParFamille.map(r => r.count);

    if (this.donutChartInstance) {
      this.donutChartInstance.destroy();
    }

    const config: ChartConfiguration<'doughnut', number[], string> = {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          label: 'Répartition par famille',
          data,
          backgroundColor: [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
            '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
          ],
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#334155',
              font: { 
                size: 13,
                family: 'Inter'
              },
              padding: 20,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: 'rgba(30, 41, 59, 0.9)',
            titleFont: { 
              weight: 'bold',
              family: 'Inter'
            },
            bodyFont: { 
              size: 14,
              family: 'Inter'
            },
            callbacks: {
              label: (context) =>
                `${context.label}: ${context.parsed} demandes`
            }
          }
        }
      }
    };

    this.donutChartInstance = new Chart(canvas, config);
  }

  onProjetChange(): void {
    this.initDonutChart();
  }

  downloadPDF(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const currentDate = new Date().toLocaleDateString('fr-FR');

    // En-tête
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text('RAPPORT DES TESTS ICP', pageWidth / 2, 25, { align: 'center' });

    // Informations
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    
    const infoY = 40;
    doc.text(`Projet: ${this.selectedProjet || 'Tous les projets'}`, 20, infoY);
    doc.text(`Run: ${this.selectedRun || 'Non spécifié'}`, 20, infoY + 6);
    doc.text(`Version: ${this.versionText || 'Non renseignée'}`, 20, infoY + 12);
    doc.text(`Date: ${currentDate}`, 20, infoY + 18);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(239, 68, 68);
    doc.text(`Total demandes ICP: ${this.totalICP}`, pageWidth - 60, infoY + 18);

    // Chart
    const chartCanvas = document.getElementById('donutChart') as HTMLCanvasElement;
    const chartImage = chartCanvas?.toDataURL('image/png', 1.0);
    if (chartImage) {
      doc.addImage(chartImage, 'PNG', 20, 55, 80, 80);
    }

    // Tableau
    const tableY = 150;
    
    autoTable(doc, {
      head: [['Famille Technique', 'Fonction à Tester', 'Commentaire']],
      body: this.filteredTests.map(t => [
        t.familleTechnique || '—',
        t.fonctionsATester || '—',
        t.commentaire || 'RAS'
      ]),
      startY: tableY,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 4,
        font: 'helvetica'
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { top: 10 },
      didDrawPage: (data) => {
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${data.pageNumber} sur ${doc.getNumberOfPages()}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
    });

    // Export
    const fileName = `rapport-icp-${this.selectedProjet || 'global'}-${currentDate.replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
  }
}
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PptxGenJS from 'pptxgenjs';

interface PlanningItem {
  famille: string;
  fonctionATester: string;
  dateDebut: string;
  dateFin: string;
  projet: string;
  run?: string;
  version?: string;
}

interface PlanningItemParsed {
  famille: string;
  fonction: string;
  debut: Date;
  fin: Date;
  debutOffset: number;
  duree: number;
  projet: string;
  couleur: string;
  run?: string;
  version?: string;
  
}

// Fonction utilitaire Type Guard pour filtrer les valeurs définies
function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css'],
  providers: [DatePipe]
})
export class PlanningComponent implements OnInit {
  planningData: PlanningItemParsed[] = [];
  groupedData: { [famille: string]: PlanningItemParsed[] } = {};
  startDate: Date = new Date();
  endDate: Date = new Date();
  totalDays = 0;

  projets: string[] = [];
  selectedProjet: string = '';

  familles: string[] = [];
  selectedFamille: string = '';

  runs: string[] = [];
  selectedRun: string = '';

  versions: string[] = [];
  versionText: string = '';


  familleDeadlines: { [famille: string]: Date } = {};
  familleCouleurs: { [famille: string]: string } = {};

  tooltipVisible = false;
  tooltipPosition = { x: 0, y: 0 };
  currentTooltip: PlanningItemParsed | null = null;

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadPlanningData();
  }

  private loadPlanningData(): void {
    this.http.get<PlanningItem[]>('http://localhost:8081/sagem/api/planning').subscribe({
      next: (data) => {
        this.planningData = this.processData(data);

        // Filtres avec type guard pour supprimer undefined
        this.projets = [...new Set(this.planningData.map(p => p.projet).filter(isDefined))];
        this.familles = [...new Set(this.planningData.map(p => p.famille).filter(isDefined))];

        this.generateColors();
        this.calculateFamilleDeadlines();
        this.updateGroupedData();
      },
      error: (err) => console.error('Error loading planning data:', err)
    });
  }

  private processData(data: PlanningItem[]): PlanningItemParsed[] {
    const parsed = data.map(item => ({
      famille: item.famille,
      fonction: item.fonctionATester,
      debut: new Date(item.dateDebut),
      fin: new Date(item.dateFin),
      debutOffset: 0,
      duree: 0,
      projet: item.projet,
      couleur: '',
      run: item.run,
      version: item.version
    }));

    this.calculateDateRange(parsed);
    this.calculateOffsetsAndDurations(parsed);

    return parsed;
  }

  private calculateDateRange(data: PlanningItemParsed[]): void {
    const dates = data.flatMap(p => [p.debut.getTime(), p.fin.getTime()]);
    this.startDate = new Date(Math.min(...dates));
    this.endDate = new Date(Math.max(...dates));
    this.totalDays = Math.ceil((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 3600 * 24)) + 1;
  }

  private calculateOffsetsAndDurations(data: PlanningItemParsed[]): void {
    data.forEach(p => {
      p.debutOffset = Math.floor((p.debut.getTime() - this.startDate.getTime()) / (1000 * 3600 * 24));
      p.duree = Math.ceil((p.fin.getTime() - p.debut.getTime()) / (1000 * 3600 * 24)) + 1;
    });
  }

  updateGroupedData(): void {
    const filtered = this.planningData
      .filter(p => !this.selectedProjet || p.projet === this.selectedProjet)
      .filter(p => !this.selectedFamille || p.famille === this.selectedFamille)

    this.groupedData = filtered.reduce((acc, curr) => {
      if (!acc[curr.famille]) acc[curr.famille] = [];
      acc[curr.famille].push(curr);
      return acc;
    }, {} as { [famille: string]: PlanningItemParsed[] });
  }

  onProjetChange(): void {
    this.updateGroupedData();
  }

  onFamilleChange(): void {
    this.updateGroupedData();
  }

  onRunChange(): void {
    this.updateGroupedData();
  }

  onVersionChange(): void {
    this.updateGroupedData();
  }

  addDays(baseDate: Date, days: number): Date {
    const result = new Date(baseDate);
    result.setDate(result.getDate() + days);
    return result;
  }

  totalDaysArray(): number[] {
    return Array.from({ length: this.totalDays }, (_, i) => i);
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  showTooltip(event: MouseEvent, item: PlanningItemParsed): void {
    this.currentTooltip = item;
    this.tooltipPosition = {
      x: event.clientX - 110,
      y: event.clientY - 150
    };
    this.tooltipVisible = true;
  }

  hideTooltip(): void {
    this.tooltipVisible = false;
  }

  private generateColors(): void {
    const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#e377c2', '#d62728', '#9467bd', '#8c564b', '#17becf'];
    let i = 0;
    this.familles.forEach(f => {
      this.familleCouleurs[f] = colors[i % colors.length];
      i++;
    });

    this.planningData.forEach(p => {
      p.couleur = this.familleCouleurs[p.famille];
    });
  }

  private calculateFamilleDeadlines(): void {
    this.familleDeadlines = {};

    for (const item of this.planningData) {
      const famille = item.famille;
      if (!this.familleDeadlines[famille] || item.fin > this.familleDeadlines[famille]) {
        this.familleDeadlines[famille] = item.fin;
      }
    }
  }

  getDeadline(famille: string): string {
    const deadline = this.familleDeadlines[famille];
    return deadline ? this.datePipe.transform(deadline, 'yyyy-MM-dd') ?? '' : '';
  }

  calculateOffset(date: Date): number {
    const dayInMs = 24 * 60 * 60 * 1000;
    const start = new Date(this.startDate).setHours(0, 0, 0, 0);
    const target = new Date(date).setHours(0, 0, 0, 0);
    const diffDays = Math.floor((target - start) / dayInMs);
    return diffDays * 16; // 16px par jour, cohérent avec le HTML
  }

  getColor(famille: string): string {
    const colors = [
      '#08b8f8ff', // bleu
      '#e4a19bff', // rouge
      '#d2bb7aff', // jaune
      '#79dfaeff', // vert
      '#bea2c3ff', // violet
      '#00ACC1', // turquoise
      '#FF7043', // orange
      '#9E9D24', // olive
    ];

    const index = this.familles.indexOf(famille);
    return colors[index % colors.length];
  }

  downloadPDF() {
    const element = document.querySelector('.planning-container') as HTMLElement;
    if (!element) return;

    html2canvas(element).then((canvas: HTMLCanvasElement) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('planning.pdf');
    });
  }
}
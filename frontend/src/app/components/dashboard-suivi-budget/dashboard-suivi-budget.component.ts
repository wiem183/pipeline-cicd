import {
  Component,
  OnInit,
  AfterViewInit
} from '@angular/core';

import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';

import { BudgetCMS } from 'src/app/models/budget-cms.model';
import { BudgetINTEG } from 'src/app/models/budget-integ.model';
import { BudgetCmsService } from 'src/app/services/budget-cms.service';
import { BudgetIntegService } from 'src/app/services/budget-integ.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dashboard-suivi-budget',
  templateUrl: './dashboard-suivi-budget.component.html',
  styleUrls: ['./dashboard-suivi-budget.component.css']
})
export class DashboardSuiviBudgetComponent implements OnInit, AfterViewInit {
  budgetCMS: BudgetCMS[] = [];
  budgetINTEG: BudgetINTEG[] = [];

  selectedProject: string = '';
  selectedRun: string = '';
  versionText: string = '';
  showReel: boolean = false; 

  constructor(
    private cmsService: BudgetCmsService,
    private integService: BudgetIntegService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadData();
      });

    this.loadData();

    // Écoute des événements venant du chatbot
    window.addEventListener('chatbotGeneratePDF', () => {
      this.downloadPDF();
    });

    window.addEventListener('chatbotSetProject', (e: any) => {
      this.selectedProject = e.detail;
    });
  }

  ngAfterViewInit(): void {
    const ecart = this.totalGlobalReel - this.totalGlobalPrevus;
    const pourcentage = this.tauxDepassementGlobal.toFixed(1);
    const resume = ecart > 0
      ? `Le budget a dépassé de ${ecart.toFixed(0)} €, soit ${pourcentage} % de plus.`
      : `Le budget est sous contrôle avec une économie de ${Math.abs(ecart).toFixed(0)} € (${pourcentage} %).`;

    localStorage.setItem('budget_resume', resume);

    // Stocke aussi un top 1 écart projet
    const fusion = [...this.budgetCMS, ...this.budgetINTEG];
    const regroupement = fusion.reduce((acc: any, curr: any) => {
      const key = curr.projet;
      const prevu = curr.coutsInterfaceTest ?? 0;
      const reel = curr.budgetConsomm ?? 0;
      acc[key] = acc[key] || { projet: key, prevu: 0, reel: 0 };
      acc[key].prevu += prevu;
      acc[key].reel += reel;
      return acc;
    }, {});

    const analyse = Object.values(regroupement)
      .map((proj: any) => ({
        projet: proj.projet,
        ecart: proj.reel - proj.prevu
      }))
      .sort((a: any, b: any) => b.ecart - a.ecart);

    localStorage.setItem('budget_analysis', JSON.stringify(analyse));
  }

  loadData(): void {
    this.cmsService.getAll().subscribe(cms => {
      this.budgetCMS = cms.filter(item =>
        item.coutsInterfaceTest != null && item.coutsInterfaceTest > 0 &&
        item.nbre != null && item.nbre > 0
      );
    });

    this.integService.getAll().subscribe(integ => {
      this.budgetINTEG = integ.filter(item =>
        item.coutsInterfaceTest != null && item.coutsInterfaceTest > 0 &&
        item.nbre != null && item.nbre > 0
      );
    });
  }

  // === GETTERS POUR LES FILTRES ===
  get filteredCMS() {
    return this.budgetCMS.filter(i => !this.selectedProject || i.projet === this.selectedProject);
  }

  get filteredINTEG() {
    return this.budgetINTEG.filter(i => !this.selectedProject || i.projet === this.selectedProject);
  }

  get totalCMSPrevus() {
    return this.filteredCMS.reduce((sum, item) => sum + (item.coutsInterfaceTest || 0), 0);
  }

  get totalCMSReel() {
    return this.filteredCMS.reduce((sum, item) => sum + (item. budgetConsomm || 0), 0);
  }

  get totalINTEGPrevus() {
    return this.filteredINTEG.reduce((sum, item) => sum + (item.coutsInterfaceTest || 0), 0);
  }

  get totalINTEGReel() {
    return this.filteredINTEG.reduce((sum, item) => sum + (item. budgetConsomm || 0), 0);
  }

  get totalGlobalPrevus() {
    return this.totalCMSPrevus + this.totalINTEGPrevus;
  }

  get totalGlobalReel() {
    return this.totalCMSReel + this.totalINTEGReel;
  }

  get tauxDepassementGlobal() {
    const prevu = this.totalGlobalPrevus;
    const reel = this.totalGlobalReel;
    if (prevu === 0) return 0;
    return ((reel - prevu) / prevu) * 100;
  }

  get projects(): string[] {
    const all = [...this.budgetCMS, ...this.budgetINTEG].map(b => b.projet);
    return Array.from(new Set(all.filter(p => p)));
  }

  getEtat(data: BudgetCMS[] | BudgetINTEG[]) {
    const phases = new Map<string, { phase: string, prevu: number, reel: number, ecart: number, etat: string }>();

    data
      .filter(i => !this.selectedProject || i.projet === this.selectedProject)
      .forEach(item => {
        const phase = item.processPhaseOperations ?? 'UNKNOWN';
        const prevu = item.coutsInterfaceTest ?? 0;
        const reel = item.budgetConsomm  ?? 0;

        const ecart = prevu - reel; // + = économie, - = surcoût
        const etat = ecart >= 0 ? 'Gain' : 'Surcoût';

        if (phases.has(phase)) {
          const old = phases.get(phase)!;
          old.prevu += prevu;
          old.reel += reel;
          old.ecart = old.prevu - old.reel; // recalcul
          old.etat = old.ecart >= 0 ? 'Gain' : 'Surcoût';
        } else {
          if (prevu !== 0 || reel !== 0) {
            phases.set(phase, {
              phase,
              prevu,
              reel,
              ecart,
              etat
            });
          }
        }
      });

    return Array.from(phases.values());
  }

  get etatCMS() {
    return this.getEtat(this.budgetCMS);
  }

  get etatINTEG() {
    return this.getEtat(this.budgetINTEG);
  }

  // === EXPORT PDF ===
  async downloadPDF(): Promise<void> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let posY = 20;

    // Titre principal
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 37, 41);
    doc.text('Rapport Suivi Budgétaire CMS & INTEG', pageWidth / 2, posY, { align: 'center' });
    posY += 8;

    // Ligne décorative
    doc.setDrawColor(33, 37, 41);
    doc.setLineWidth(1);
    doc.line(pageWidth * 0.15, posY, pageWidth * 0.85, posY);
    posY += 15;

    // Infos projet colorées
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    doc.setTextColor(41, 128, 185);
    doc.text(`Projet : ${this.selectedProject || 'Tous les projets'}`, 14, posY);
    posY += 7;

    doc.setTextColor(52, 152, 219);
    doc.text(`Run : ${this.selectedRun || 'Non spécifié'}`, 14, posY);
    posY += 7;

    doc.setTextColor(93, 173, 226);
    doc.text(`Version : ${this.versionText || 'Non spécifiée'}`, 14, posY);
    posY += 7;

    doc.setTextColor(80);
    doc.text(`Date : ${new Date().toLocaleDateString()}`, 14, posY);
    posY += 12;

    // Capture de la div KPI
    const kpiElement = document.getElementById('kpi-export');
    if (!kpiElement) {
      alert('Impossible de trouver les KPI Cards dans la page.');
      return;
    }

    const scale = 3.5;
    const canvas = await html2canvas(kpiElement, { scale: scale } as any);
    const imgData = canvas.toDataURL('image/png');

    const margin = 2;
    const pdfWidth = pageWidth - margin * 2;
    const imgProps = doc.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    doc.addImage(imgData, 'PNG', margin, posY, pdfWidth, pdfHeight);
    posY += pdfHeight + 18;

    // État global unique
    const isGlobalDepassement = this.totalGlobalReel > this.totalGlobalPrevus;
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    if (isGlobalDepassement) {
      doc.setTextColor(231, 76, 60);
      doc.text('ATTENTION : Dépassement global détecté !', 14, posY);
    } else {
      doc.setTextColor(39, 174, 96);
      doc.text('Budget global sous contrôle', 14, posY);
    }
    posY += 22;

    // Tableau CMS
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33);
    doc.text('Détails par phase - CMS', 14, posY);
    posY += 10;

    autoTable(doc, {
      head: [['Phase', 'Prévu (€)', 'Réel (€)', 'Écart (€)', 'État']],
      body: this.etatCMS.map(item => [
        item.phase,
        item.prevu.toFixed(0),
        item.reel.toFixed(0),
        item.ecart.toFixed(0),
        item.etat
      ]),
      startY: posY,
      styles: { fontSize: 11 },
      headStyles: { fillColor: [25, 118, 210] },
      theme: 'grid',
      margin: { horizontal: 10 }
    });

    posY = (doc as any).lastAutoTable.finalY + 18;

    // Tableau INTEG
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33);
    doc.text('Détails par phase - INTEG', 14, posY);
    posY += 10;

    autoTable(doc, {
      head: [['Phase', 'Prévu (€)', 'Réel (€)', 'Écart (€)', 'État']],
      body: this.etatINTEG.map(item => [
        item.phase,
        item.prevu.toFixed(0),
        item.reel.toFixed(0),
        item.ecart.toFixed(0),
        item.etat
      ]),
      startY: posY,
      styles: { fontSize: 11 },
      headStyles: { fillColor: [76, 175, 80] },
      theme: 'grid',
      margin: { horizontal: 10 }
    });

    doc.save(`rapport-budget-${this.selectedProject || 'global'}.pdf`);
  }

  // === CHATBOT ===
  handleChatMessage(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("résumé") || lowerMessage.includes("budget")) {
      return localStorage.getItem('budget_resume') || "Aucun résumé disponible pour le moment.";
    }

    if (lowerMessage.includes("projet")) {
      return "Veuillez sélectionner un projet dans la liste déroulante pour voir ses détails.";
    }

    if (lowerMessage.includes("export")) {
      this.downloadPDF();
      return "📄 Export PDF généré avec succès.";
    }

    if (lowerMessage.includes("bonjour") || lowerMessage.includes("salut")) {
      return "Bonjour 👋 ! Je suis votre assistant budgétaire. Posez-moi une question.";
    }

    return "Je n'ai pas compris votre demande. Essayez avec des mots comme 'résumé', 'export', 'projet'...";
  }

  addMessage(sender: 'user' | 'bot', text: string): void {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'user' ? 'text-right mb-2' : 'text-left mb-2';

    const innerDiv = document.createElement('div');
    innerDiv.className = sender === 'user' 
      ? 'inline-block bg-gray-200 rounded-lg p-2' 
      : 'inline-block bg-blue-100 text-blue-800 rounded-lg p-2';

    innerDiv.textContent = text;
    msgDiv.appendChild(innerDiv);
    container.appendChild(msgDiv);

    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }

  handleUserInput(input: string): void {
    const message = input.toLowerCase().trim();
    this.addMessage('user', input);

    if (message.includes('résumé')) {
      const resume = localStorage.getItem('budget_resume') || "Aucun résumé disponible.";
      this.addMessage('bot', resume);

    } else if (message.includes('projets')) {
      const projets = this.projects.join(', ');
      this.addMessage('bot', `Projets disponibles : ${projets}`);

    } else if (message.startsWith('filtre projet')) {
      const projet = message.split('filtre projet')[1].trim();
      this.selectedProject = projet;
      this.loadData();
      this.addMessage('bot', `Filtre appliqué sur le projet : ${projet}`);

    } else if (message.includes('exporte')) {
      this.downloadPDF();
      this.addMessage('bot', "Exportation du PDF en cours...");

    } else {
      this.addMessage('bot', "Désolé, je n'ai pas compris. Essayez : résumé, projets, filtre projet, exporte PDF");
    }
  }

  sendChatMessage(): void {
    const input = document.getElementById('chat-input') as HTMLInputElement;
    const container = document.getElementById('chat-messages');
    const message = input.value.trim();
    if (!message) return;

    this.addMessage('user', input.value);
    const response = this.handleChatMessage(message);
    this.addMessage('bot', response);

    input.value = '';
    container?.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }
}

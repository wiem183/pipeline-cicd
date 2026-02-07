import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BudgetCMS } from 'src/app/models/budget-cms.model';
import { BudgetINTEG } from 'src/app/models/budget-integ.model';
import { BudgetCmsService } from 'src/app/services/budget-cms.service';
import { BudgetIntegService } from 'src/app/services/budget-integ.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard-budget',
  templateUrl: './dashboard-budget.component.html',
  styleUrls: ['./dashboard-budget.component.css']
})
export class DashboardBudgetComponent implements OnInit, AfterViewInit {
  budgetCMS: BudgetCMS[] = [];
  budgetINTEG: BudgetINTEG[] = [];
  projects: string[] = [];
  selectedProject: string = '';

  cmsChart: Chart | undefined;
  integChart: Chart | undefined;

  constructor(
    private cmsService: BudgetCmsService,
    private integService: BudgetIntegService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateCharts(), 500);
  }

  loadData() {
    this.cmsService.getAll().subscribe(data => {
      this.budgetCMS = data;
      this.updateProjects();
      this.updateCharts();
    });

    this.integService.getAll().subscribe(data => {
      this.budgetINTEG = data;
      this.updateProjects();
      this.updateCharts();
    });
  }

  updateProjects() {
    const cmsProjects = this.budgetCMS.map(item => item.projet);
    const integProjects = this.budgetINTEG.map(item => item.projet);
    this.projects = Array.from(new Set([...cmsProjects, ...integProjects]));
  }

  filterData() {
    this.updateCharts();
  }

  get totalCMS() {
    return this.filteredBudgetCMS.reduce((sum, item) => sum + (item.coutsInterfaceTest || 0), 0);
  }

  get totalINTEG() {
    return this.filteredBudgetINTEG.reduce((sum, item) => sum + (item.coutsInterfaceTest || 0), 0);
  }

  get totalGlobal() {
    return this.totalCMS + this.totalINTEG;
  }

  get filteredBudgetCMS() {
    return this.budgetCMS.filter(i => !this.selectedProject || i.projet === this.selectedProject);
  }

  get filteredBudgetINTEG() {
    return this.budgetINTEG.filter(i => !this.selectedProject || i.projet === this.selectedProject);
  }

  updateCharts() {
    this.createCMSChart();
    this.createINTEGChart();
  }

  createCMSChart() {
    if (this.cmsChart) this.cmsChart.destroy();

    this.cmsChart = new Chart('cmsChart', {
      type: 'bar',
      data: {
        labels: this.filteredBudgetCMS.map(item => item.processPhaseOperations),
        datasets: [{
          label: 'Couts Interface Test CMS',
          data: this.filteredBudgetCMS.map(item => item.coutsInterfaceTest),
          backgroundColor: '#3498db'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        }
      }
    });
  }

  createINTEGChart() {
    if (this.integChart) this.integChart.destroy();

    this.integChart = new Chart('integChart', {
      type: 'bar',
      data: {
        labels: this.filteredBudgetINTEG.map(item => item.processPhaseOperations),
        datasets: [{
          label: 'Couts Interface Test INTEG',
          data: this.filteredBudgetINTEG.map(item => item.coutsInterfaceTest),
          backgroundColor: '#f39c12'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        }
      }
    });
  }
}

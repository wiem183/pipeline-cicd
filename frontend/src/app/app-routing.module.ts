import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { PurchasingManagerComponent } from './purchasing-manager/purchasing-manager.component';
import { SalesManagerComponent } from './sales-manager/sales-manager.component';
import { PlanningComponent } from './planning/planning.component';
import { QuoiTesterComponent } from './quoi-tester/quoi-tester.component';  
import { FinanceManagerComponent } from './finance-manager/finance-manager.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { DashboardQuoiTesterComponent } from './components/dashboard-quoi-tester/dashboard-quoi-tester.component';
import { DashboardBudgetComponent } from './components/dashboard-budget/dashboard-budget.component';
import { DashboardSuiviBudgetComponent } from './components/dashboard-suivi-budget/dashboard-suivi-budget.component';
import { SoftDeTestComponent } from './components/soft-de-test/soft-de-test.component'; 
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'test', component: TestComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'purchasing-manager', component: PurchasingManagerComponent, canActivate: [authGuard] },
  { path: 'sales-manager', component: SalesManagerComponent, canActivate: [authGuard] },
  { path: 'finance-manager', component: FinanceManagerComponent, canActivate: [authGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'general-manager', component: AdminComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
   { path: 'register', component: RegisterComponent },
  { path: 'file-upload', component: FileUploadComponent, canActivate: [authGuard] },
  { path: 'dashboard-quoi-tester', component: DashboardQuoiTesterComponent, canActivate: [authGuard] },
  { path: 'dashboard-budget', component: DashboardBudgetComponent, canActivate: [authGuard] },
  { path: 'dashboard-suivi-budget', component: DashboardSuiviBudgetComponent, canActivate: [authGuard] },
  { path: 'dashboard-soft-de-test', component: SoftDeTestComponent, canActivate: [authGuard] },
  { path:'planning',component:PlanningComponent, canActivate: [authGuard]},
  { path: 'quoi-tester', component: QuoiTesterComponent, canActivate: [authGuard] },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

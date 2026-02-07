import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TestComponent } from './test/test.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { FormsModule } from '@angular/forms';
import { PurchasingManagerComponent } from './purchasing-manager/purchasing-manager.component';
import { SalesManagerComponent } from './sales-manager/sales-manager.component';
import { FinanceManagerComponent } from './finance-manager/finance-manager.component';
import { AdminComponent } from './admin/admin.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { LoginComponent } from './login/login.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { NgChartsModule } from 'ng2-charts';
import { VisualisationComponent } from './visualisation/visualisation.component';
import { DashboardQuoiTesterComponent } from './components/dashboard-quoi-tester/dashboard-quoi-tester.component';
import { DashboardBudgetComponent } from './components/dashboard-budget/dashboard-budget.component';
import { DashboardSuiviBudgetComponent } from './components/dashboard-suivi-budget/dashboard-suivi-budget.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { SoftDeTestComponent } from './components/soft-de-test/soft-de-test.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PlanningComponent } from './planning/planning.component';

import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { DateAddPipe } from './pipes/date-add.pipe';
import { QuoiTesterComponent } from './quoi-tester/quoi-tester.component';
import { RegisterComponent } from './register/register.component';

registerLocaleData(localeFr); // Enregistrement de la locale française

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    TestComponent,
    HomeComponent,
    DashboardComponent,
    UserComponent,
    AboutusComponent,
    PurchasingManagerComponent,
    SalesManagerComponent,
    FinanceManagerComponent,
    AdminComponent,
    LoginComponent,
    FileUploadComponent,
    VisualisationComponent,
    DashboardQuoiTesterComponent,
    DashboardBudgetComponent,
    DashboardSuiviBudgetComponent,
    SoftDeTestComponent,
    PlanningComponent,
    DateAddPipe,
    QuoiTesterComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    NgChartsModule,
    HttpClientModule,
    NgCircleProgressModule.forRoot({}),
    NgxChartsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'fr-FR' } // ✅ Fournit la locale au pipe DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

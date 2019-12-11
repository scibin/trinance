import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home.component';
import { RegisterComponent } from './components/register.component';
import { DashboardComponent } from './components/dashboard.component';
import { GauthComponent } from './components/gauth.component';

// Manually added
import { AccessService } from './services/access.service';
import { EthService } from './services/eth.service';
import { MaterialModule } from './material.module';
import { PrimeNgModule } from './primeng.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './components/login.component';
import { ProfileComponent } from './components/user/profile.component';
import { DepositComponent } from './components/user/deposit.component';
import { WithdrawalComponent } from './components/user/withdrawal.component';
import { TradeComponent } from './components/user/trade.component';
import { HistoryComponent } from './components/user/history.component';
import { FavouritesComponent } from './components/user/favourites.component';
import { TokenInterceptor } from './services/token.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    DashboardComponent,
    GauthComponent,
    LoginComponent,
    ProfileComponent,
    DepositComponent,
    WithdrawalComponent,
    TradeComponent,
    HistoryComponent,
    FavouritesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    PrimeNgModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    AccessService,
    EthService,
    // Http interceptor to add Bearer token
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

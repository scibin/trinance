import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { RegisterComponent } from './components/register.component';
import { DashboardComponent } from './components/dashboard.component';
import { GauthComponent } from './components/gauth.component';
import { LoginComponent } from './components/login.component';
import { DepositComponent } from './components/user/deposit.component';
import { WithdrawalComponent } from './components/user/withdrawal.component';
import { TradeComponent } from './components/user/trade.component';
import { ProfileComponent } from './components/user/profile.component';
import { FavouritesComponent } from './components/user/favourites.component';
import { HistoryComponent } from './components/user/history.component';
import { AccessService } from './services/access.service';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user/auth/google', component: GauthComponent },
  { path: 'user/dashboard', component: DashboardComponent, canActivate: [ AccessService ] },
  { path: 'user/deposit', component: DepositComponent, canActivate: [ AccessService ]  },
  { path: 'user/withdrawal', component: WithdrawalComponent, canActivate: [ AccessService ]  },
  { path: 'user/trade', component: TradeComponent, canActivate: [ AccessService ]  },
  { path: 'user/profile', component: ProfileComponent, canActivate: [ AccessService ]  },
  { path: 'user/history', component: HistoryComponent, canActivate: [ AccessService ]  },
  { path: 'user/favourites', component: FavouritesComponent, canActivate: [ AccessService ]  },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

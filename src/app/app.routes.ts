import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StockComponent } from './stock/stock.component';
import { AccountingComponent } from './accounting/accounting.component';
import { ConfigShopComponent } from './config-shop/config-shop.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'stock', component: StockComponent},
    {path: 'accounting', component: AccountingComponent},
    {path: 'configuration', component: ConfigShopComponent}
];

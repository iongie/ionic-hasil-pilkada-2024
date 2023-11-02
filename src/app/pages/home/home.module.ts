import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { TopBarDirective } from 'src/app/directives/topBar/top-bar.directive';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    NgApexchartsModule,
    ComponentsModule
  ],
  declarations: [HomePage, TopBarDirective]
})
export class HomePageModule {}

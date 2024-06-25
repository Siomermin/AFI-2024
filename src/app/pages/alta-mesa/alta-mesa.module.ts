import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaMesaPageRoutingModule } from './alta-mesa-routing.module';

import { AltaMesaPage } from './alta-mesa.page';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltaMesaPageRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
  declarations: [AltaMesaPage]
})
export class AltaMesaPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IdiomaPopoverPageRoutingModule } from './idioma-popover-routing.module';

import { IdiomaPopoverPage } from './idioma-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IdiomaPopoverPageRoutingModule
  ],
  declarations: [IdiomaPopoverPage]
})
export class IdiomaPopoverPageModule {}

import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { LoginPageComponent } from './pages/login-page/login-page.component';


@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    AuthRoutingModule,
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
})
export class AuthModule {}

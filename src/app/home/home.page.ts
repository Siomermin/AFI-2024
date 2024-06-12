import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit  {

  private authService = inject(AuthService);
  public loggedUser: any;

  ngOnInit(): void {
    this.loggedUser = this.authService.loggedUser;
  }

  logout() {
    this.authService.logout();
  }
}

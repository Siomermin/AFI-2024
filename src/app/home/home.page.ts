import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit  {

  private authService = inject(AuthService);
  public loggedUser: any;

  constructor(private router:Router){}
  ngOnInit(): void {
    this.loggedUser = this.authService.loggedUser;

  }

  logout() {
    this.authService.logout();
  }

  redireccionar(path:string){
    this.router.navigateByUrl(path);
  }


 
}

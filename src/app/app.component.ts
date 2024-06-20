import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit
 {
  public router = inject(Router);

  constructor() {}

 ngOnInit(): void {
    this.router.navigateByUrl('splash');
 }
}

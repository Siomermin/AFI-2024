import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from './shared/services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public router = inject(Router);

  constructor(private language: LanguageService) {}
  
  ngOnInit(): void {
    this.language.setInitialAppLanguage();
    this.router.navigateByUrl('splash');
  }
}

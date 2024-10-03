import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';

  constructor(private translate: TranslateService) { }

  setInitialAppLanguage() {
    this.translate.setDefaultLang('es');
    console.log("Language set");
    this.selected = 'es';
  }

  getLanguages() {
    return [
      { text: 'English', value: 'en', img: 'assets/images/flags/Usa.png'},
      { text: 'Español', value: 'es', img: 'assets/images/flags/Mex.png'},
      { text: 'Portugues', value: 'pr', img: 'assets/images/flags/Bra.png'},
      { text: 'Русский', value: 'rs', img: 'assets/images/flags/Rus.png'},
      { text: 'Français', value: 'fr', img: 'assets/images/flags/Fra.png'},
      { text: 'Deutsch', value: 'gr', img: 'assets/images/flags/Ger.png'}
    ];
  }

  setLanguage(lang: any) {
    this.translate.use(lang);
    this.selected = lang;
  }
}

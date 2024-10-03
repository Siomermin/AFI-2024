import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-idioma-popover',
  templateUrl: './idioma-popover.page.html',
  styleUrls: ['./idioma-popover.page.scss'],
})
export class IdiomaPopoverPage implements OnInit {
  languages: Array<any> = [];
  selected = '';

  constructor(private popoverCtrl: PopoverController, private language: LanguageService) { }

  ngOnInit() {
    this.languages = this.language.getLanguages();
    this.selected = this.language.selected;
  }

  select(lang: any) {
    this.language.setLanguage(lang);
    this.popoverCtrl.dismiss();
  }

}

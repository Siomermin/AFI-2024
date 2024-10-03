import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent   {

  public text: string = '';

  constructor(private translator: TranslateService) { 
    this.text = this.translator.instant("ALERT.spinner"); 
  }


}

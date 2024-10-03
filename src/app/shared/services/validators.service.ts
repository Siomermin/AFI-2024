import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ValidatorsService {

  constructor(private translator: TranslateService) {}

  public firstNameAndLastnamePattern: string = '([a-zA-Z]+) ([a-zA-Z]+)';
  public emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  public error = {
    detail: ''
  }

  public isValidField(form: FormGroup, field: string) {
    return form.controls[field].errors && form.controls[field].touched;
  }

  getErrorByField(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};

    console.log(errors);

    for (const key of Object.keys(errors)) {

      switch (key) {
        case 'required':
          //return 'Requerido';
          return this.translator.instant('VALIDATORS.required');
        case 'minlength':
          this.error.detail = errors['minlength'].requiredLength;
          return this.translator.instant('VALIDATORS.min_length', this.error);
        case 'maxlength':
          this.error.detail = errors['maxlength'].requiredLength
          return this.translator.instant('VALIDATORS.max_length', this.error);
        case 'min':
          this.error.detail = errors['min'].min;
          return this.translator.instant('VALIDATORS.min', this.error);
        case 'pattern':
          return this.translator.instant('VALIDATORS.pattern');
      }
    }

    return null;
  }

  getFirebaseAuthErrorByCode(code: string): string {
    switch (code) {
      case 'auth/invalid-credential':
        return this.translator.instant('VALIDATORS.usr_credential_invalid');

      case 'auth/email-already-in-use':
        return this.translator.instant('VALIDATORS.usr_email_repeated');
    }
    return '';
  }
}

import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorsService {
  public firstNameAndLastnamePattern: string = '([a-zA-Z]+) ([a-zA-Z]+)';
  public emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

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
          return 'Requerido';

        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;

        case 'maxlength':
          return `Máximo ${errors['maxlength'].requiredLength} caracteres`;


        case 'min':
          return `Mínimo ${errors['min'].min}`;

        case 'pattern':
          return `Ingrese un email valido`;
      }
    }

    return null;
  }

  getFirebaseAuthErrorByCode(code: string): string {
    switch (code) {
      case 'auth/invalid-credential':
        return 'Las credenciales son incorrectas.';

        case 'auth/email-already-in-use':
          return 'El correo electrónico ya está siendo utilizado por otro usuario.'
    }

    return '';
  }
}

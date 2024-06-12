import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ValidatorsService } from 'src/app/shared/services/validators.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { TestUser } from '../../interfaces/testUser.Interface';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private authService = inject(AuthService);

  checkboxSelected: any = null; // Variable para almacenar el checkbox seleccionado

  public testUsers: TestUser[] = [];
  public isLoading: boolean = false;

  public myForm: FormGroup = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(this.validatorsService.emailPattern),
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  selectCheckbox(user: any) {
    this.checkboxSelected = user; // Asignar el usuario seleccionado a la variable
  }

  ngOnInit(): void {
    this.testUsers = this.authService.testUsers;
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.myForm, field);
  }

  getErrorByField(field: string): string | null {
    return this.validatorsService.getErrorByField(this.myForm, field);
  }

  login(email: string, password: string): void {
    this.isLoading = true;
    this.authService.login(email, password).then(() => {
      this.isLoading = false;
      this.myForm.reset(); // Optionally reset after successful login
    });
  }

  fastLogin(email: string, password: string): void {
    this.myForm.controls['email'].setValue(email);
    this.myForm.controls['password'].setValue(password);
  }

  onSubmit(): void {
    const { email, password } = this.myForm.value;
    this.login(email, password);
  }
}

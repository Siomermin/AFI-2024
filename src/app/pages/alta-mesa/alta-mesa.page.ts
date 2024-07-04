import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { PhotoStorageService } from 'src/app/shared/services/photo-storage.service';
import { ValidatorsService } from 'src/app/shared/services/validators.service';
import Swal from 'sweetalert2';

// D- Alta de Mesa
// ● Se cargará el número, la cantidad de comensales y el tipo (VIP, para discapacitados, estándar, etc.)
// ● Con foto tomada del celular.
// ● Generar el código QR correspondiente.
// ● Esta acción la realizará el supervisor o el dueño.

@Component({
  selector: 'app-alta-mesa',
  templateUrl: './alta-mesa.page.html',
  styleUrls: ['./alta-mesa.page.scss'],
})
export class AltaMesaPage {
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private photoService = inject(PhotoStorageService);
  private database = inject(DatabaseService);

  public isLoading: boolean = false;

  rutaImagen?: string;
  imagenAFile: any;

  public myForm: FormGroup = this.fb.group({
    numero: ['', [Validators.required, Validators.min(1)]],
    cantidadComensales: ['', [Validators.required, Validators.min(1)]],
    tipo: [null, [Validators.required]],
  });


  isValidField(field: string) {
    return this.validatorsService.isValidField(this.myForm, field);
  }

  getErrorByField(field: string) {
    return this.validatorsService.getErrorByField(this.myForm, field);
  }

  async takePhoto() {
    try {
      this.isLoading = true;

      const downloadUrl = await this.photoService.takePhoto();
      this.rutaImagen = downloadUrl;
      console.log('Returned download URL:', downloadUrl);

      this.isLoading = false;

    } catch (error) {
      console.error('Error taking photo:', error);
      this.isLoading = false;
    }
  }

  register() {
    const { numero, cantidadComensales, tipo } = this.myForm.value;
    const mesa = {
      numero: numero,
      cantidadComensales: cantidadComensales,
      tipo: tipo,
      imagen: this.rutaImagen
    }

    this.database.crear("mesas", mesa)
    .then((docRef) => {
      console.log("Documento escrito con ID: ", docRef.id);

      Swal.fire({
        title: "Éxito",
        text: "La mesa ha sido creada exitosamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: 'var(--ion-color-primary)',
        heightAuto: false
      });

    })
    .catch((error) => {
      console.error("Error al dar de alta la mesa:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al dar de alta la mesa. Por favor, inténtelo de nuevo.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: 'var(--ion-color-primary)',
        heightAuto: false
      });
    });

    this.isLoading = false;
  }

  async onSubmit() {
    if (this.myForm.valid) {
      this.register();
    }
  }
}

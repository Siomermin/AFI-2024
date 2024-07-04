import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  storageRef = firebase.app().storage().ref();
  
  async subirImagen(carpeta: string, nombre: string, imgBase64: any) {
    try {
      let respuesta = await this.storageRef.child(`${carpeta}/${nombre}`).putString(imgBase64, 'data_url');
      console.log(respuesta);
      return respuesta.ref.getDownloadURL();
    } catch (err) {
      console.log(err);
      return null;
    }
  }


  async obtenerImagen(carpeta:string, nombreImg: string) {
    try {
      const url = await this.storageRef.child(carpeta +"/"+ nombreImg).getDownloadURL();
      return url;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
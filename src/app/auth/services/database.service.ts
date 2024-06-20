import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore) {}

  obtenerTodos(collection: string) {
    try {
      return this.firestore.collection(collection).snapshotChanges();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  obtenerClientesPendientes() {
    try {
      return this.firestore.collection('clientes', ref => ref.where('estado', '==', 'pendiente')).snapshotChanges();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  public actualizar(coleccion: string, data: any, id: string) {
    return this.firestore.collection(coleccion).doc(id).set(data);
  }


  public crear(collection: string, data: any): Promise<any> {
    return this.firestore.collection(collection).add(data);
  }

}

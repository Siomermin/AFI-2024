import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { first, map } from 'rxjs';

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

  obtenerClientePorEmail(email: string) {
    try {
      return this.firestore.collection('clientes', ref => ref.where('email', '==', email))
        .snapshotChanges()
        .pipe(
          map(actions => {
            if (actions.length === 0) {
              return null; // No encontro cliente
            }
            const data = actions[0].payload.doc.data() as any;
            const id = actions[0].payload.doc.id;
            return { id, ...data }; // Retorno el primer cliente encontrado
          }),
          first()
        )
        .toPromise();
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

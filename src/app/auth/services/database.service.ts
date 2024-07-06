import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { first, map } from 'rxjs/operators';

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
      return this.firestore.collection('clientes', ref => ref
        .where('estado', '==', 'pendiente')
        .where('anonimo', '==', false)
      ).snapshotChanges();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  obtenerUsuarioPorEmail(email: string): Promise<any | null> {
    return this.firestore.collection('usuarios', ref => ref.where('email', '==', email))
      .snapshotChanges()
      .pipe(
        map(actions => {
          if (actions.length === 0) {
            return null; // No encontró usuario
          }
          const data = actions[0].payload.doc.data() as any;
          const id = actions[0].payload.doc.id;
          return { id, ...data }; // Retorna el primer usuario encontrado
        }),
        first()
      )
      .toPromise()
      .catch(error => {
        console.error('Error retrieving usuario:', error);
        return null; // Return null in case of error
      });
  }

  obtenerClientePorEmail(email: string): Promise<any | null> {
    return this.firestore.collection('clientes', ref => ref.where('email', '==', email))
      .snapshotChanges()
      .pipe(
        map(actions => {
          if (actions.length === 0) {
            return null; // No encontró cliente
          }
          const data = actions[0].payload.doc.data() as any;
          const id = actions[0].payload.doc.id;
          return { id, ...data }; // Retorna el primer cliente encontrado
        }),
        first()
      )
      .toPromise()
      .catch(error => {
        console.error('Error retrieving cliente:', error);
        return null; // Return null in case of error
      });
  }

  obtenerPedidos(estado: string, confirmacionMozo: boolean) {
    try {
      return this.firestore.collection('pedidos', ref => ref
        .where('estado', '==', estado)
        .where('confirmacionMozo', '==', confirmacionMozo)
      ).snapshotChanges();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  obtenerPedidosParaElMozo(estado: string[]) {
    try {
      return this.firestore.collection('pedidos', ref => ref
        .where('estado', 'in', estado) // Utiliza 'in' para comparar con múltiples valores
      ).snapshotChanges();
    } catch (error) {
      console.error('Error fetching pedidos:', error);
      return null;
    }
  }

  obtenerPedidosPorEstados(estado: string[], confirmacionMozo: boolean) {
    try {
      return this.firestore.collection('pedidos', ref => ref
        .where('estado', 'in', estado) // Utiliza 'in' para comparar con múltiples valores
        .where('confirmacionMozo', '==', confirmacionMozo)
      ).snapshotChanges();
    } catch (error) {
      console.error('Error fetching pedidos:', error);
      return null;
    }
  }

  obtenerDocumento(coleccion: string, documentoId: string) {
    return this.firestore.collection(coleccion).doc(documentoId).snapshotChanges()
      .pipe(
        map(action => {
          if (action.payload.exists) {
            const data = action.payload.data() as any;
            const id = action.payload.id;
            return { id, ...data };
          } else {
            return null;
          }
        }),
        first()
      );
  }

  public actualizar(coleccion: string, data: any, id: string) {
    return this.firestore.collection(coleccion).doc(id).set(data);
  }

  public actualizar2(coleccion: string, data: any, id: string) {
    return this.firestore.collection(coleccion).doc(id).update(data);
  }

  public crear(collection: string, data: any): Promise<any> {
    return this.firestore.collection(collection).add(data);
  }

  public borrar(collection: string, docId: string): Promise<void> {
    return this.firestore.collection(collection).doc(docId).delete();
  }

}

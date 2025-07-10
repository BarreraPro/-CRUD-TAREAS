import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getFirestore, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface Tarea {
  id?: string;
  titulo: string;
  descripcion: string;
  completado: boolean;
  prioridad?: 'alta' | 'media' | 'baja';
  fecha: string;
}

export type FiltroTarea = 'todas' | 'pendientes' | 'completadas';

@Injectable({
  providedIn: 'root',
})
export class TareaService {
  private tareasCollection: AngularFirestoreCollection<Tarea>;
  private firestoreDb = getFirestore();

  constructor(private afs: AngularFirestore) {
    this.tareasCollection = afs.collection<Tarea>('tareas', (ref) =>
      ref.orderBy('titulo')
    );

    this.tareasCollection = afs.collection<Tarea>('tareas', (ref) =>
      ref.orderBy('fecha', 'asc')
    );
  }

  getTareas(): Observable<Tarea[]> {
    return this.tareasCollection.valueChanges({ idField: 'id' });
  }

  getTareasFiltradas(filtro: FiltroTarea): Observable<Tarea[]> {
    return this.getTareas().pipe(
      map((tareas) => {
        switch (filtro) {
          case 'pendientes':
            return tareas.filter((tarea) => !tarea.completado);
          case 'completadas':
            return tareas.filter((tarea) => tarea.completado);
          default:
            return tareas;
        }
      })
    );
  }

  agregarTarea(tarea: Tarea): Promise<any> {
    const nuevaTarea = { ...tarea, completado: false };
    return this.tareasCollection.add(nuevaTarea);
  }

  actualizarTarea(id: string, tarea: Partial<Tarea>): Promise<void> {
    const tareaDocRef = doc(this.firestoreDb, `tareas/${id}`);
    return updateDoc(tareaDocRef, tarea);
  }

  eliminarTarea(id: string): Promise<void> {
    const tareaDocRef = doc(this.firestoreDb, `tareas/${id}`);
    return deleteDoc(tareaDocRef);
  }
}

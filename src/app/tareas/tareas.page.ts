import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Tarea, TareaService, FiltroTarea } from '../services/tarea.service';
import {
  AlertController,
  LoadingController,
  ModalController,
  ViewWillEnter,
} from '@ionic/angular';
import { TareaModalPage } from '../tarea-modal/tarea-modal.page';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.page.html',
  styleUrls: ['./tareas.page.scss'],
  standalone: false,
})
export class TareasPage implements OnInit, ViewWillEnter {
  tareas: Tarea[] = [];
  tareas$!: Observable<Tarea[]>;
  tareasSub!: Subscription;
  filtroActual: FiltroTarea = 'todas';

  constructor(
    private tareaService: TareaService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ionViewWillEnter(): void {}

  ngOnInit() {
    this.aplicarFiltro('todas');
  }

  aplicarFiltro(filtro: FiltroTarea | string | undefined) {
    // Validar que el filtro sea válido
    if (
      filtro === 'todas' ||
      filtro === 'pendientes' ||
      filtro === 'completadas'
    ) {
      this.filtroActual = filtro;
      this.tareas$ = this.tareaService.getTareasFiltradas(filtro);
    }
  }

  onSegmentChange(event: any) {
    this.aplicarFiltro(event.detail.value);
  }

  async abrirModal(tarea?: Tarea) {
    const modal = await this.modalCtrl.create({
      component: TareaModalPage,
      componentProps: { tarea },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        if (tarea) {
          this.actualizarTarea(tarea.id!, result.data);
        } else {
          this.agregarTarea(result.data);
        }
      }
    });

    return await modal.present();
  }

  async agregarTarea(nuevaTarea: Tarea) {
    const loading = await this.loadingCtrl.create({
      message: 'Agregando tarea...',
    });
    await loading.present();

    this.tareaService.agregarTarea(nuevaTarea).then(() => {
      loading.dismiss();
      this.mostrarAlert('Éxito', 'Tarea agregada correctamente.');
    });
  }

  async actualizarTarea(id: string, datos: Partial<Tarea>) {
    const loading = await this.loadingCtrl.create({
      message: 'Actualizando tarea...',
    });
    await loading.present();

    try {
      await this.tareaService.actualizarTarea(id, datos);
      this.mostrarAlert('Éxito', 'Tarea actualizada correctamente.');
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      this.mostrarAlert('Error', 'No se pudo actualizar la tarea.');
    } finally {
      loading.dismiss();
    }
  }

  async eliminarTarea(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Seguro que deseas eliminar esta tarea?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: 'Eliminando...',
            });
            await loading.present();

            try {
              await this.tareaService.eliminarTarea(id);
              this.mostrarAlert('Éxito', 'Tarea eliminada correctamente.');
            } catch (error) {
              console.error('Error eliminando tarea:', error);
              this.mostrarAlert('Error', 'No se pudo eliminar la tarea.');
            } finally {
              loading.dismiss();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async mostrarAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  ngOnDestroy() {
    if (this.tareasSub) {
      this.tareasSub.unsubscribe();
    }
  }
}

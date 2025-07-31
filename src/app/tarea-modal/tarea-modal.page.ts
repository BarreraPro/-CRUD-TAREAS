import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Tarea } from '../services/tarea.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tarea-modal',
  templateUrl: './tarea-modal.page.html',
  styleUrls: ['./tarea-modal.page.scss'],
  standalone: false,
})
export class TareaModalPage implements OnInit {
  @Input() tarea: Tarea | null = null;
  form: FormGroup;
  isEditing: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private alertCtrl: AlertController
  ) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      fecha: ['', Validators.required],
      completado: [false],
    });
  }

  ngOnInit() {
    this.isEditing = !!this.tarea?.id;

    if (this.tarea) {
      this.form.patchValue(this.tarea);
    } else {
      this.form.patchValue({
        titulo: '',
        descripcion: '',
        fecha: new Date().toISOString(),
        completado: false,
      });
    }
  }

  async guardar() {
    if (this.form.invalid) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'El título es obligatorio',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const tareaData = this.form.value;

    // Si es una nueva tarea, asegurar que completado sea false
    if (!this.isEditing) {
      tareaData.completado = false;
    }

    this.modalCtrl.dismiss(tareaData);
  }

  cancelar() {
    this.modalCtrl.dismiss();
  }
}

import { Component, OnInit } from '@angular/core';
import { TareaService, Tarea } from './services/tarea.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private tareaService: TareaService) {}
  ngOnInit(): void {}
}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'tareas',
    pathMatch: 'full',
  },
  {
    path: 'tareas',
    loadChildren: () =>
      import('./tareas/tareas.module').then((m) => m.TareasPageModule),
  },
  {
    path: 'tarea-modal',
    loadChildren: () =>
      import('./tarea-modal/tarea-modal.module').then(
        (m) => m.TareaModalPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

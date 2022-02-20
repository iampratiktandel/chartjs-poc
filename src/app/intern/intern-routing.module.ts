import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternFormComponent } from './intern-form/intern-form.component';
import { InternListComponent } from './intern-list/intern-list.component';
import { InternProfileComponent } from './intern-profile/intern-profile.component';
import { InternComponent } from './intern.component';

const routes: Routes = [
  { 
    path: '', 
    component: InternComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: InternListComponent
      },
      {
        path: 'add',
        component: InternFormComponent
      },
      {
        path: 'edit/:id',
        component: InternFormComponent
      },
      {
        path: ':id',
        component: InternProfileComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternRoutingModule { }

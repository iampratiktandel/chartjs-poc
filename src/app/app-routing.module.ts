import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChildTwoComponent } from './child-two/child-two.component';
import { ChildComponent } from './child/child.component';
import { MentorListComponent } from './mentor/mentor-list/mentor-list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ParentComponent } from './parent/parent.component';

const routes: Routes = [
  // basic routing
  {
    path: '',
    component: ParentComponent,
    children: [
      {
        path: 'child',
        component: ChildComponent,
        children: [
          {
            path: '',
            redirectTo: 'child-two',
            pathMatch: 'full'
          },
          {
            path: 'child-two',
            component: ChildTwoComponent
          }
        ]
      },
      {
        path: 'child-two',
        component: ChildTwoComponent
      },
      // module routing
      {
        path: 'mentor',
        component: MentorListComponent
      }
    ]
  },
  // lazy loading
  { 
    path: 'intern', 
    loadChildren: () => import('./intern/intern.module').then(m => m.InternModule) 
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

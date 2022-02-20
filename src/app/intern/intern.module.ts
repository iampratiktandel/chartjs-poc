import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InternRoutingModule } from './intern-routing.module';
import { InternComponent } from './intern.component';
import { InternFormComponent } from './intern-form/intern-form.component';
import { InternListComponent } from './intern-list/intern-list.component';
import { InternService } from './intern.service';
import { HttpClientModule } from '@angular/common/http';
import { InternProfileComponent } from './intern-profile/intern-profile.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InternComponent,
    InternFormComponent,
    InternListComponent,
    InternProfileComponent
  ],
  imports: [
    CommonModule,
    InternRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    InternService
  ]
})
export class InternModule { }

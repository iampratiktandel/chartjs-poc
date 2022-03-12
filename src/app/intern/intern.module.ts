import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InternFormComponent } from './intern-form/intern-form.component';
import { InternListComponent } from './intern-list/intern-list.component';
import { InternProfileComponent } from './intern-profile/intern-profile.component';
import { InternRoutingModule } from './intern-routing.module';
import { InternComponent } from './intern.component';
import { InternService } from './intern.service';



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

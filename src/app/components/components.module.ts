import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateItemComponent } from './candidate-item/candidate-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';



@NgModule({
  declarations: [
    CandidateItemComponent,
    ProgressBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [
    CandidateItemComponent,
    ProgressBarComponent
  ]
})
export class ComponentsModule { }

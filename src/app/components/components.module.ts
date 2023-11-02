import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateItemComponent } from './candidate-item/candidate-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ListRankingComponent } from './list-ranking/list-ranking.component';
import { ListRankingSkeletonComponent } from './progress-indicator/list-ranking-skeleton/list-ranking-skeleton.component';
import { CandidateItemSkeletonComponent } from './progress-indicator/candidate-item-skeleton/candidate-item-skeleton.component';
import { ChartSkeletonComponent } from './progress-indicator/chart-skeleton/chart-skeleton.component';



@NgModule({
  declarations: [
    CandidateItemComponent,
    ProgressBarComponent,
    ListRankingComponent,
    ListRankingSkeletonComponent,
    CandidateItemSkeletonComponent,
    ChartSkeletonComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [
    CandidateItemComponent,
    ProgressBarComponent,
    ListRankingComponent,
    ListRankingSkeletonComponent,
    CandidateItemSkeletonComponent,
    ChartSkeletonComponent
  ]
})
export class ComponentsModule { }

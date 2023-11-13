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
import { InfoModalCandidateComponent } from './info-modal-candidate/info-modal-candidate.component';
import { InfoVoteCandidateComponent } from './info-vote-candidate/info-vote-candidate.component';
import { InfoVoteCandidateSkeletonComponent } from './progress-indicator/info-vote-candidate-skeleton/info-vote-candidate-skeleton.component';



@NgModule({
  declarations: [
    CandidateItemComponent,
    ProgressBarComponent,
    ListRankingComponent,
    ListRankingSkeletonComponent,
    CandidateItemSkeletonComponent,
    ChartSkeletonComponent,
    InfoModalCandidateComponent,
    InfoVoteCandidateComponent,
    InfoVoteCandidateSkeletonComponent
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
    ChartSkeletonComponent,
    InfoModalCandidateComponent,
    InfoVoteCandidateComponent,
    InfoVoteCandidateSkeletonComponent
  ]
})
export class ComponentsModule { }

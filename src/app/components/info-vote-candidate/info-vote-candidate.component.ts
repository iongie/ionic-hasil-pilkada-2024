import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Subject, combineLatest, takeUntil, delay, concatMap, tap, from, switchMap, timer } from 'rxjs';
import { getBarChart } from 'src/app/app.chart';
import { Vote } from 'src/app/app.interface';
import { CallApiService } from 'src/app/services/callApi/call-api.service';
import { MessageResponseService } from 'src/app/services/messageResponse/message-response.service';
import { TokenService } from 'src/app/services/token/token.service';
import { VoteService } from 'src/app/services/vote/vote.service';

@Component({
  selector: 'app-info-vote-candidate',
  templateUrl: './info-vote-candidate.component.html',
  styleUrls: ['./info-vote-candidate.component.scss'],
})
export class InfoVoteCandidateComponent  implements OnInit {
  @Input() id: number = 0;
  private destroy: Subject<void> = new Subject<void>();
  resultVoteLoading: boolean = true;
  voteInfo: Vote[] = [];
  dataInfoVoteNotFound: boolean = false;
  @Output() infoVoteEvent = new EventEmitter<any>();
  constructor(
    private callApiServ: CallApiService,
    private tokenServ: TokenService,
    private voteServ: VoteService,
    private messageResponse: MessageResponseService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.getData();
    this.voteServ.getVote.subscribe(res => {
      console.log('info vote state', res),
      this.voteInfo = res
    })
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  getData(){
    return combineLatest([
      this.tokenServ.getToken
    ]).pipe(
      takeUntil(this.destroy),
      delay(1000),
      concatMap(([token]) => {
        return this.callApiServ.get(`data-vote-caleg/${this.id}`, token)
      }),
      tap(()=> this.resultVoteLoading = false),
    )
      .subscribe({
        error: (e) => this.resultVoteLoading = true,
        next: (res: any) => (
          console.log('info vote', res),
          this.voteServ.updateVote(res.data),
          this.dataInfoVoteNotFound= res.data.length === 0 ? true:false
        )
      })
  }

  deletePolling(event:any){
    from(this.loadingCtrl.create({
      message: 'loading...',
      duration: 100,
    })).pipe(
      tap((loading) => loading.present()),
      tap(() => timer(1000)),
      switchMap(() => this.tokenServ.getToken),
      switchMap((token) => this.callApiServ.post(null,`delete-vote-caleg/${event}`, token)),
      tap(()=> this.getData()),
      takeUntil(this.destroy),
    ).subscribe(
      {
        next: (res: any) => (
          this.messageResponse.updateMessageResponse(res.message),
          this.messageResponse.updateStatusResponse(true),
          this.messageResponse.updatePositionResponse('top'),
          this.messageResponse.updatePositionAnchorResponse('header'),
          this.messageResponse.updateTypeResponse('success')),
        error: (e) => (
          this.messageResponse.updateMessageResponse(e.error.message),
          this.messageResponse.updateStatusResponse(true),
          this.messageResponse.updatePositionResponse('bottom'),
          this.messageResponse.updatePositionAnchorResponse('footer'),
          this.messageResponse.updateTypeResponse('dark')
        )
      }
    )
  }

  updatePolling(event:any){
    this.infoVoteEvent.emit(this.voteInfo.filter(val => val.id == event)[0])
  }

}

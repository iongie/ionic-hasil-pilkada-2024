import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subject, from, switchMap, takeUntil, tap, timer } from 'rxjs';
import { Candidate, VoteCaleg, defaultCandidateValue, defaultVoteCaleg } from 'src/app/app.interface';
import { CallApiService } from 'src/app/services/callApi/call-api.service';
import { MessageResponseService } from 'src/app/services/messageResponse/message-response.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-candidate-item',
  templateUrl: './candidate-item.component.html',
  styleUrls: ['./candidate-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CandidateItemComponent implements OnInit, OnDestroy {
  private destroy: Subject<void> = new Subject<void>();
  isModalOpen = false
  voteCaleg: VoteCaleg = defaultVoteCaleg;
  voteCalegForm!: FormGroup;
  @Input() status: boolean = false;
  @Input() total: number = 0;
  @Input() candidates: Candidate[] = [
    defaultCandidateValue
  ];
  candidate: Candidate = defaultCandidateValue
  filterCandidate: Candidate[] = [defaultCandidateValue]
  @Output() dataChanged = new EventEmitter<object>();
  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private callApi: CallApiService,
    private token: TokenService,
    private messageResponse: MessageResponseService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.voteCalegForm = this.fb.group({
      id_caleg: [this.voteCaleg.id_caleg, [Validators.required]],
      no_tps: [this.voteCaleg.no_tps, [Validators.required]],
      total_suara: [this.voteCaleg.total_suara, [Validators.required]]
    })

    console.log(this.status);
    
  }
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  get noTps() {
    return this.voteCalegForm.get('no_tps')!;
  }

  get noTpsRequest() {
    return this.noTps.hasError('required') && this.noTps.touched;
  }

  get totalSuara() {
    return this.voteCalegForm.get('total_suara')!;
  }

  get totalSuaraRequest() {
    return this.totalSuara.errors?.['required'] && this.totalSuara.touched;
  }

  getById(ev: any) {
    this.candidate = this.candidates[ev]
    this.voteCalegForm.patchValue({ id_caleg: this.candidates[ev].id })
  }


  updateCandidates(updateCandidate: any, id: any){
    this.filterCandidate = this.candidates.filter(val => val.id !== id)
    this.dataChanged.emit([updateCandidate, ...this.filterCandidate])
  }

  simpanPolling() {
    this.voteCalegForm.valid
      && from(this.loadingCtrl.create({
        message: 'loading...',
        duration: 100,
      })).pipe(
        tap((loading) => loading.present()),
        tap(() => timer(1000)),
        switchMap(() => this.token.getToken),
        switchMap((token) => this.callApi.post(this.voteCalegForm.value, 'vote-caleg', token)),
        tap(() => this.modalCtrl.dismiss(this.voteCaleg, 'confirm')),
        tap(()=> this.candidate.jumlah_suara = this.voteCalegForm.value.total_suara),
        tap(()=> this.updateCandidates(this.candidate, this.candidate.id)),
        tap(() => this.voteCalegForm.reset(defaultVoteCaleg)),
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
}

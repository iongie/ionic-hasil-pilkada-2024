import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subject, from, switchMap, takeUntil, tap, timer } from 'rxjs';
import { Candidate, VoteCaleg, defaultCandidateValue, defaultVoteCaleg } from 'src/app/app.interface';
import { CallApiService } from 'src/app/services/callApi/call-api.service';
import { MessageResponseService } from 'src/app/services/messageResponse/message-response.service';
import { TokenService } from 'src/app/services/token/token.service';
import { Camera, CameraResultType } from '@capacitor/camera';

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
  @Output() dataChanged = new EventEmitter<string>();
  upload_bukti_camera: any;
  updateVote: boolean = false;
  idDataVote: number = 0;
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
      no_tps: [{ value: this.voteCaleg.no_tps, disabled: false }, [Validators.required]],
      total_suara: [this.voteCaleg.total_suara, [Validators.required]],
      file_bukti: [null, [Validators.required]]
    })
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


  updateCandidates(updateCandidate: any, id: any) {
    // this.filterCandidate = this.candidates.filter(val => val.id !== id)
    // this.dataChanged.emit([updateCandidate, ...this.filterCandidate])
  }

  getFileFromBase64(base64: string, fileName: string) {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    const myBlob = new Blob([byteArray], { type: 'image/png' });
    const uniqueFileName = Date.now() + '_' + fileName;
    return new File([myBlob], uniqueFileName, { lastModified: new Date().getTime(), type: 'image/png' });
  }


  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl
    });
    let imageUrl = await image.dataUrl;
    this.upload_bukti_camera = await imageUrl;
    this.voteCalegForm.patchValue({
      file_bukti: this.getFileFromBase64(this.upload_bukti_camera, 'file_bukti.png')
    })
  }

  simpanPolling() {
    const voteFormData = new FormData()
    voteFormData.append('id_caleg', this.voteCalegForm.get('id_caleg')?.value)
    voteFormData.append('no_tps', this.voteCalegForm.get('no_tps')?.value)
    voteFormData.append('total_suara', this.voteCalegForm.get('total_suara')?.value)
    voteFormData.append('file_bukti', this.voteCalegForm.get('file_bukti')?.value)
    this.voteCalegForm.valid
      && from(this.loadingCtrl.create({
        message: 'loading...',
        duration: 100,
      })).pipe(
        tap((loading) => loading.present()),
        tap(() => timer(1000)),
        switchMap(() => this.token.getToken),
        switchMap((token) => this.callApi.post(voteFormData, 'vote-caleg', token)),
        tap(() => this.modalCtrl.dismiss(this.voteCaleg, 'confirm')),
        tap(() => this.dataChanged.emit('update')),
        tap(() => this.upload_bukti_camera = undefined),
        tap(() => this.voteCalegForm.reset(defaultVoteCaleg)),
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

  updatePolling() {
    const updateVoteFormData = new FormData()
    updateVoteFormData.append('total_suara', this.voteCalegForm.get('total_suara')?.value)
    updateVoteFormData.append('file_bukti', this.voteCalegForm.get('file_bukti')?.value)
    this.voteCalegForm.valid
      && from(this.loadingCtrl.create({
        message: 'loading...',
        duration: 100,
      })).pipe(
        tap((loading) => loading.present()),
        tap(() => timer(1000)),
        switchMap(() => this.token.getToken),
        switchMap((token) => this.callApi.post(updateVoteFormData, `update-vote-caleg/${this.idDataVote}`, token)),
        tap(() => this.modalCtrl.dismiss(this.voteCaleg, 'confirm')),
        tap(() => this.dataChanged.emit('update')),
        tap(() => this.upload_bukti_camera = undefined),
        tap(() => this.voteCalegForm.reset(defaultVoteCaleg)),
        tap(() => this.voteCalegForm.get('no_tps')?.enable()),
        tap(() => this.updateVote = false),
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

  actionPolling() {
    this.updateVote ? this.updatePolling() : this.simpanPolling()
  }

  async canDismiss(data?: any, role?: string) {
    return role !== 'gesture';
  }

  infoVote(event: any) {
    this.idDataVote = event.id;
    this.updateVote = true;
    this.voteCalegForm.patchValue({
      id_caleg: event.id_caleg,
      no_tps: event.tps,
      total_suara: event.suara,
      file_bukti: event.file_bukti,
    })
    this.voteCalegForm.get('no_tps')?.disable()
  }

  cancelPolling() {
    this.updateVote = false;
    this.modalCtrl.dismiss(this.voteCaleg, 'confirm');
    this.voteCalegForm.reset(defaultVoteCaleg)
    this.voteCalegForm.get('no_tps')?.enable()
  }

}

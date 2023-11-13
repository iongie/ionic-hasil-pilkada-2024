import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, combineLatest, delay, forkJoin, map, switchMap, takeUntil, tap } from 'rxjs';
import { Candidate, defaultCandidateValue } from 'src/app/app.interface';
import { CallApiService } from 'src/app/services/callApi/call-api.service';
import { CandidateService } from 'src/app/services/candidate/candidate.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.page.html',
  styleUrls: ['./candidate.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CandidatePage implements OnInit, OnDestroy {
  private destroy: Subject<void> = new Subject<void>();
  candidates: Candidate[] = [];
  totalCandidate: number = 0;
  dataNotFound: boolean = false;
  loaderSkeleton: boolean = true;
  constructor(
    private actRoute: ActivatedRoute,
    private tokenServ: TokenService,
    private callApiServ: CallApiService,
    private candidateServ: CandidateService
  ) { }

  ngOnInit() {
    this.getData();
    this.candidateServ.getCandidate
      .pipe(
        takeUntil(this.destroy),
      )
      .subscribe({
        error: (e) => (this.dataNotFound = e),
        next: (res) => (this.candidates = res)
      })
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  getData() {
    return combineLatest([
      this.actRoute.params,
      this.tokenServ.getToken
    ]).pipe(
      takeUntil(this.destroy),
      delay(1000),
      switchMap(([param, token]) => {
        return this.callApiServ.get('data-caleg/' + param['id'], token).pipe(
          map((tambah) => [tambah, token])
        )
      }),
      tap(([res, token]: any) => this.totalCandidate = res.total_data),
      switchMap(([param, token]: any) => {
        const observablesArray = param.data.map((val: Candidate) =>
          this.callApiServ.get('get-total-suara-caleg/' + val.no_urut, token).pipe(
            map((suara: any) => ({ ...val, suara: suara.total_suara }))
          )
        );

        return forkJoin(observablesArray)
      }),
      tap(() => this.loaderSkeleton = false),
    )
      .subscribe({
        error: (e) => null,
        next: (res: any) => (
          this.dataNotFound = res.length === 0 ? true : false,
          this.candidateServ.updateCandidate(res)
        )
      })
  }

  onDataChanged(updateCandidate: any) {
    if (updateCandidate === 'update'){
      this.getData();
      this.candidateServ.getCandidate
        .pipe(
          takeUntil(this.destroy),
        )
        .subscribe({
          error: (e) => (this.dataNotFound = e),
          next: (res) => (this.candidates = res)
        })
    }
  }

  onInputChange(ev: any) {
    this.candidateServ.filterCandidate(ev.target.value)
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
        this.dataNotFound = res.length === 0 ? true : false
        this.candidates = res
      })
  }

  backToHistory() {
    this.dataNotFound = false
    this.candidateServ.updateCandidate([defaultCandidateValue])
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getData();
      this.candidateServ.getCandidate
        .pipe(
          takeUntil(this.destroy),
        )
        .subscribe({
          error: (e) => (this.dataNotFound = e),
          next: (res) => (this.candidates = res)
        })
      event.target.complete();
    }, 2000);
  }

}

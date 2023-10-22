import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, combineLatest, mergeMap, of, switchMap, take, takeUntil, throwError } from 'rxjs';
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
        error: (e) => (console.log(e), this.dataNotFound = e),
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
      switchMap(([param, token]) => {
        return this.callApiServ.get('data-caleg/' + param['id'], token)
      })
    )
      .subscribe({
        error: (e) => this.dataNotFound = true,
        next: (res: any) => (
          console.log(res.data),
          this.candidateServ.updateCandidate(res.data),
          this.totalCandidate = res.total_data
        )
      })
  }

  onInputChange(ev: any) {
    this.candidateServ.filterCandidate(ev.target.value)
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
        this.dataNotFound= res.length === 0 ? true:false
        this.candidates = res
      })
  }

  backToHistory() {
    this.dataNotFound = false
    this.candidateServ.updateCandidate([defaultCandidateValue])
  }

}
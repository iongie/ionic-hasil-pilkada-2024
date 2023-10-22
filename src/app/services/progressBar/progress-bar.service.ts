import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProgressIndicator, defaultProgressIndicator } from 'src/app/app.interface';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  progressIndicatorState = new BehaviorSubject<ProgressIndicator>(defaultProgressIndicator)
  constructor() { }

  getProgressIndicator = this.progressIndicatorState.asObservable()

  updateProgressIndicator(newState: ProgressIndicator){
    this.progressIndicatorState.next(newState)
  }
}

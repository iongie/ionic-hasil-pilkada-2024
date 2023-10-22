import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { ProgressBarService } from 'src/app/services/progressBar/progress-bar.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent  implements OnInit, OnDestroy, OnChanges {
  value: number = 0;
  view: boolean = false;
  @Input() onChangeViewOfParent: boolean = false;
  @Output() onChangeViewOfChild = new EventEmitter<boolean>(false)
  private destroy: Subject<void> = new Subject<void>();
  constructor(private progressIndicatorServ: ProgressBarService){}

  ngOnInit(): void {
    this.processView();
  }

  ngOnDestroy(): void {
    this.destroy.next()
    this.destroy.complete()
  }

  ngOnChanges(changes: SimpleChanges): void {
    changes['onChangeViewOfParent'].currentValue && this.processView()
  }

  processView(){
    const interval = setInterval(() => {
        if (this.value < 100) {
          this.value += 50;
          this.view = true;
        } else {
          clearInterval(interval);
          this.view = false;
          this.value = 0;
          this.progressIndicatorServ.updateProgressIndicator({value: 100, view:true})
          this.onChangeViewOfChild.emit(false);
        }
      }, 500);
    return interval;
  }
}

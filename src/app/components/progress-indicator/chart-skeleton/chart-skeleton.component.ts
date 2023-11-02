import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart-skeleton',
  templateUrl: './chart-skeleton.component.html',
  styleUrls: ['./chart-skeleton.component.scss'],
})
export class ChartSkeletonComponent  implements OnInit {
  @Input() subtitle: string| null = null;
  constructor() { }

  ngOnInit() {}

}

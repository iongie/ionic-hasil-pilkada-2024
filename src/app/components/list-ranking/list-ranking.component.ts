import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-list-ranking',
  templateUrl: './list-ranking.component.html',
  styleUrls: ['./list-ranking.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListRankingComponent  implements OnInit {
  @Input() title: string | null = null;
  @Input() subtitle: string | null = null;
  constructor() { }

  ngOnInit() {}

}

import { Component, Input, OnInit } from '@angular/core';
import { Candidate, defaultCandidateValue } from 'src/app/app.interface';

@Component({
  selector: 'app-info-modal-candidate',
  templateUrl: './info-modal-candidate.component.html',
  styleUrls: ['./info-modal-candidate.component.scss'],
})
export class InfoModalCandidateComponent  implements OnInit {
  @Input() candidate: Candidate = defaultCandidateValue;
  constructor() { }

  ngOnInit() {}

}

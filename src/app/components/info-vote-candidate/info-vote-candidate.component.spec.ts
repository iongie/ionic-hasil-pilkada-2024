import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoVoteCandidateComponent } from './info-vote-candidate.component';

describe('InfoVoteCandidateComponent', () => {
  let component: InfoVoteCandidateComponent;
  let fixture: ComponentFixture<InfoVoteCandidateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoVoteCandidateComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoVoteCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

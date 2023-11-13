import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoVoteCandidateSkeletonComponent } from './info-vote-candidate-skeleton.component';

describe('InfoVoteCandidateSkeletonComponent', () => {
  let component: InfoVoteCandidateSkeletonComponent;
  let fixture: ComponentFixture<InfoVoteCandidateSkeletonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoVoteCandidateSkeletonComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoVoteCandidateSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

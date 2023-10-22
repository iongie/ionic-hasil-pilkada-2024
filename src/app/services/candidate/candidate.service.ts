import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Candidate } from 'src/app/app.interface';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  candidate = new BehaviorSubject<Candidate[]>([])
  constructor() { }

  getCandidate = this.candidate.asObservable()

  updateCandidate(newCandidate: Candidate[]){
    this.candidate.next(newCandidate)
  }

  filterCandidate(text: string) {
    return this.candidate.pipe(
      map(candidate => {
        return candidate.filter((val) => {
          return val.nama_calon.toLowerCase().includes(text.toLowerCase())
          ? val.nama_calon.toLowerCase().includes(text.toLowerCase())
          : val.no_urut.toString().toLowerCase().includes(text.toLowerCase())
            && val.no_urut.toString().toLowerCase().includes(text.toLowerCase())
        })
      })
    );
  }
}

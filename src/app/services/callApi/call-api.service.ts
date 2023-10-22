import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CallApiService {
  url = 'https://api.pilkada.tangerangselatankota.go.id/'
  constructor(
    private http: HttpClient
  ) { }


  post(data: any, param: any, token?:any){
    const cekToken = token !== undefined
    ? {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      })
    }
    : undefined
    return this.http.post(this.url+param, data, cekToken).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }

  get(param: string, token:string){
    return this.http.get(this.url+param,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      })
    }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    )
  }


}

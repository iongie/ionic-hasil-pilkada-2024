import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageResponseService {
  positionResponse = new BehaviorSubject<string>('bottom')
  positionAnchorResponse = new BehaviorSubject<string>('footer')
  statusResponse = new BehaviorSubject<boolean>(false)
  messageResponse = new Subject<string>()
  typeResponse = new BehaviorSubject<string>('dark')
  constructor() { }

  getStatusResponse = this.statusResponse.asObservable();
  getMessageResponse = this.messageResponse.asObservable();
  getPositionResponse = this.positionResponse.asObservable();
  getPositionAnchorResponse = this.positionAnchorResponse.asObservable();
  getTypeResponse = this.typeResponse.asObservable();

  updateStatusResponse(newError: boolean){
    this.statusResponse.next(newError)
  }

  updateMessageResponse(newMessage: string){
    this.messageResponse.next(newMessage)
  }

  updatePositionResponse(newPositionResponse: string){
    this.positionResponse.next(newPositionResponse)
  }

  updatePositionAnchorResponse(newPositionAnchorResponse: string){
    this.positionAnchorResponse.next(newPositionAnchorResponse)
  }

  updateTypeResponse(newTypeResponse: string){
    this.typeResponse.next(newTypeResponse)
  }
}

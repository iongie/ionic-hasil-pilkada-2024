import { Component, OnInit } from '@angular/core';
import { combineLatest, switchMap } from 'rxjs';
import { MessageResponseService } from './services/messageResponse/message-response.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  isOpen = false;
  isMessage = '';
  position = '';
  positionAnchor = '';
  typeToast = '';
  constructor(
    private messageResponse: MessageResponseService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.messageResponse.getStatusResponse,
      this.messageResponse.getMessageResponse,
      this.messageResponse.getPositionResponse,
      this.messageResponse.getPositionAnchorResponse,
      this.messageResponse.getTypeResponse
    ]).subscribe(res=>{
      this.isOpen = res[0];
      this.isMessage = res[1];
      this.position = res[2];
      this.positionAnchor = res[3];
      this.typeToast = res[4];
    })
  }

  setOpen(){
    this.isOpen = true
    this.messageResponse.updateStatusResponse(false)
  }
  
}

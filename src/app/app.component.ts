import { Component, HostListener, OnInit } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { MessageResponseService } from './services/messageResponse/message-response.service';
import { SwUpdate } from '@angular/service-worker';
import { PwaService } from './services/pwa/pwa.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isAlertOpen = false;
  isOpen = false;
  isMessage = '';
  position = '';
  positionAnchor = '';
  typeToast = ''
  constructor(
    private messageResponse: MessageResponseService,
    private swUpdate: SwUpdate,
    private pwaService: PwaService
  ) { }

  ngOnInit(): void {
    this.updatePwa();
    combineLatest([
      this.messageResponse.getStatusResponse,
      this.messageResponse.getMessageResponse,
      this.messageResponse.getPositionResponse,
      this.messageResponse.getPositionAnchorResponse,
      this.messageResponse.getTypeResponse
    ]).subscribe(res => {
      this.isOpen = res[0];
      this.isMessage = res[1];
      this.position = res[2];
      this.positionAnchor = res[3];
      this.typeToast = res[4];
    })
  }

  setOpen() {
    this.isOpen = true
    this.messageResponse.updateStatusResponse(false)
  }

  updatePwa() {
    this.swUpdate.versionUpdates
      .pipe(
        map((ver) => {
          console.log(ver);
          return ver.type !== 'NO_NEW_VERSION_DETECTED' ? true : false
        })
      )
      .subscribe((res) => {
        this.isAlertOpen = res
      })
  }

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        location.reload();
      },
    },
  ];

  setAlertOpen() {
    this.isAlertOpen = false;
  }

  @HostListener('window:beforeinstallprompt', ['$event']) beforeInstallPWA(e:any) {
    e.preventDefault();
    this.pwaService.updateInstallPrompt(e);
    this.pwaService.updateInstallPWA(true);
  }



}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  isInstallPWA =  new BehaviorSubject<boolean>(false);
  installPrompt =  new BehaviorSubject<any>(null);
  constructor() { }

  getInstallPWA = this.isInstallPWA.asObservable();
  getInstallPrompt = this.installPrompt.asObservable();

  updateInstallPWA(updateData: boolean){
    this.isInstallPWA.next(updateData)
  }

  updateInstallPrompt(updateData: any){
    this.installPrompt.next(updateData)
  }
}

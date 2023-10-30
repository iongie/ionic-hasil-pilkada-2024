import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { PwaService } from 'src/app/services/pwa/pwa.service';
import { TokenService } from 'src/app/services/token/token.service';
import { defaultUser } from 'src/app/services/user/user.interface';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements OnInit {
  name: string = '';
  isInstallPWA = false;
  installPrompt: any;
  constructor(
    private user: UserService,
    private token: TokenService,
    private router: Router,
    private pwaService: PwaService
  ) { }

  ngOnInit() {
    combineLatest([
      this.user.getUser,
      this.token.getToken
    ]).subscribe(res => {
      this.name = res[0].name
      console.log(res);

    })
  }

  gotoPage(ev: number) {
    this.router.navigate(['candidate/' + ev]);
  }

  handleScrollStart(ev: any) {
    console.log(ev);
  }

  public exitAppButtons = [
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: async () => {
        this.token.updateToken('');
        this.user.updateUser(defaultUser);
        await this.router.navigate(['/login']);
      },
    },
  ];

  async installPWA() {
    this.pwaService.getInstallPrompt
      .subscribe({
        next: (installPrompt) => (
          installPrompt.prompt(),
          installPrompt.userChoice,
          this.pwaService.updateInstallPWA(false)
        ),
        complete: () => this.pwaService.updateInstallPrompt(null)
      })
  }

}

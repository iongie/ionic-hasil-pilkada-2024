import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subject, combineLatest, delay, from, map, switchMap, takeUntil, tap, timer } from 'rxjs';
import { Login, defaultLogin } from 'src/app/app.interface';
import { CallApiService } from 'src/app/services/callApi/call-api.service';
import { MessageResponseService } from 'src/app/services/messageResponse/message-response.service';
import { PwaService } from 'src/app/services/pwa/pwa.service';
import { TokenService } from 'src/app/services/token/token.service';
import { User } from 'src/app/services/user/user.interface';
import { UserService } from 'src/app/services/user/user.service';

export interface ResponseLogin {
  message: string;
  status: number;
  token: string;
  user: User
}
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginPage implements OnInit, OnDestroy {
  login: Login = defaultLogin;
  loginForm!: FormGroup;
  destroy = new Subject<void>()
  @Input() viewProgressBar: boolean = false;
  isInstallPWA = false;
  installPrompt: any;
  constructor(
    private callApi: CallApiService,
    private token: TokenService,
    private user: UserService,
    private fb: FormBuilder,
    private router: Router,
    private messageResponse: MessageResponseService,
    private loadingCtrl: LoadingController,
    private pwaService: PwaService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: [this.login.username, [Validators.required]],
      password: [this.login.password, [Validators.required]]
    })

    this.pwaService.getInstallPWA.subscribe(res => {
      this.isInstallPWA = res
    })
  }

  ngOnDestroy(): void {
    this.destroy.next()
    this.destroy.complete()
  }

  get username() {
    return this.loginForm.get('username')!;
  }

  get usernameRequest() {
    return this.username.hasError('required') && this.username.touched;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get passwordRequest() {
    return this.password.errors?.['required'] && this.password.touched;
  }

  dataofChild(bool: any) {
    this.viewProgressBar = bool;
  }

  onSubmit() {
    this.loginForm.valid
      && from(this.loadingCtrl.create({
        message: 'loading...',
        duration: 500,
      })).pipe(
        takeUntil(this.destroy),
        tap((loading) => loading.present()),
        delay(500),
        switchMap(() => this.callApi.post(this.loginForm.value, 'auth/login')),
        tap(() => this.router.navigate(['/home'])),
        tap(() => this.loginForm.markAsTouched()),
        tap(() => this.loginForm.reset(defaultLogin))
      ).subscribe(
        {
          next: (res: any) => (
            this.token.updateToken(res.token),
            this.user.updateUser(res.user)
          ),
          error: (e) => (
            this.messageResponse.updateMessageResponse(e.error.message),
            this.messageResponse.updateStatusResponse(true),
            this.messageResponse.updatePositionResponse('top'),
            this.messageResponse.updatePositionAnchorResponse('header'),
            this.messageResponse.updateTypeResponse('dark')
          )
        })
  }

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

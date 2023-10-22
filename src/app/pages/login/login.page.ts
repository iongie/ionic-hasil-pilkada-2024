import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { from, of, switchMap, tap, timer } from 'rxjs';
import { CallApiService } from 'src/app/services/callApi/call-api.service';
import { MessageResponseService } from 'src/app/services/messageResponse/message-response.service';
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
export class LoginPage implements OnInit {
  login = { username: '', password: '' }
  loginForm!: FormGroup;
  @Input() viewProgressBar: boolean = false;
  constructor(
    private callApi: CallApiService,
    private token: TokenService,
    private user: UserService,
    private fb: FormBuilder,
    private router: Router,
    private messageResponse: MessageResponseService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: [this.login.username, [Validators.required]],
      password: [this.login.password, [Validators.required]]
    })
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
        tap((loading) => loading.present()),
        switchMap(() => timer(500)),
        switchMap(() => {
          return this.callApi.post(this.loginForm.value, 'auth/login')
        })
      ).subscribe(
        {
          next: (res: any) => (this.token.updateToken(res.token), this.user.updateUser(res.user)),
          error: (e) => (
            this.messageResponse.updateMessageResponse(e.error.message),
            this.messageResponse.updateStatusResponse(true),
            this.messageResponse.updatePositionResponse('bottom'),
            this.messageResponse.updatePositionAnchorResponse('footer'),
            this.messageResponse.updateTypeResponse('dark')
          ),
          complete: () => this.router.navigate(['home'])
        })
  }

}

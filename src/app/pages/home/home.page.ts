import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { TokenService } from 'src/app/services/token/token.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements OnInit {
  name: string = '';
  constructor(
    private user: UserService,
    private token: TokenService,
    private router: Router
  ) { }

  

  ngOnInit() {
   combineLatest([
    this.user.getUser,
    this.token.getToken
   ]).subscribe(res=>{
    this.name = res[0].name
    console.log(res);
    
   })
  }

  gotoPage(ev: number){
    this.router.navigate(['candidate/'+ev])
  }

  handleScrollStart(ev:any){
    console.log(ev);
  }

}

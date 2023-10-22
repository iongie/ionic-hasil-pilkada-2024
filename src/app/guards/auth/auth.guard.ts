import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TokenService } from 'src/app/services/token/token.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const accessToken = inject(TokenService);
  const routeServ = inject(Router);
  const token: string = await firstValueFrom(accessToken.getToken);
  return token !== "" ? true : (routeServ.navigate(['/login']), false)

};

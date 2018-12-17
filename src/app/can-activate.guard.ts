import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GameService } from './game.service';

@Injectable({
    providedIn: 'root'
})
export class CanActivateGuard implements CanActivate {
    public gameService: GameService;

    constructor(gameService: GameService, private router: Router) {
        this.gameService = gameService;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        console.log(this.gameService.isScreenReady())
        if (!this.gameService.isScreenReady()) {
            return true;
        } else {
            this.router.navigate(['/controller'])
            return false;
        }
    }
}

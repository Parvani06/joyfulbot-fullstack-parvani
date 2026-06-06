import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  userName: string = '';
  userRole: string = '';
  private currentUserSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUserSub = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.name;
        this.userRole = user.role;
      } else {
        this.userName = '';
        this.userRole = '';
      }
    });
  }

  ngOnDestroy() {
    if (this.currentUserSub) {
      this.currentUserSub.unsubscribe();
    }
  }

  isManager(): boolean {
    return this.authService.isManager();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

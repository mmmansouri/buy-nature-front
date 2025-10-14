import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { UserAuthService } from '../../services/user-auth.service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatIconButton,
    RouterLink,
    ClickOutsideDirective
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 1, 1)', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class UserMenuComponent implements OnInit {

  @Input()
  menuOpen: boolean = false;

  @Output() menuOpenChange = new EventEmitter<boolean>();

  constructor(private userAuth: UserAuthService) { }

  ngOnInit() {
  }

  closeMenu() {
    this.menuOpen = false;
    this.menuOpenChange.emit(this.menuOpen);
  }

  logout() {
    this.userAuth.logout();
    this.closeMenu();
  }

}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private sidenavState = new BehaviorSubject<boolean>(false); // false means closed by default
  public sidenavState$ = this.sidenavState.asObservable();

  toggleSidenav() {
    this.sidenavState.next(!this.sidenavState.value);
  }

  closeSidenav() {
    this.sidenavState.next(false); // Close the sidenav
  }

  openSidenav() {
    this.sidenavState.next(true); // Open the sidenav
  }
}

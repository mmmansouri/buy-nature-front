import {Component, OnInit, ViewChild} from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { SidenavService } from "../../services/sidenav.service";
import { BreakpointObserver } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [ RouterLink , MatIconModule, MatSidenavModule, MatListModule, RouterOutlet, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit  {
  isSidenavOpen = false;
  isMobile= true;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  constructor(private sidenavService: SidenavService, private observer: BreakpointObserver) {}

  ngOnInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if (screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });


    this.sidenavService.sidenavState$.subscribe((isOpen: boolean) => {

      if (this.isMobile) {
        if (this.sidenav) this.sidenav.toggle();
        this.isSidenavOpen = isOpen;
      } else {
        if (this.sidenav) this.sidenav.open();
        this.isSidenavOpen = !this.isSidenavOpen;
      }
    });


  }


}

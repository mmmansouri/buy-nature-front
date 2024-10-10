import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { SidenavService } from "./sidenav.service";
import { CommonModule } from "@angular/common";
import {ScreenService} from "../../services/screen.service";

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [ RouterLinkActive, RouterLink , MatIconModule, MatSidenavModule, MatListModule, RouterOutlet, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit  {

  @Input()
  routerLinkActiveOptions: { exact: boolean } = { exact: true };

  isSidenavOpen = false;
  isMobile= true;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;



  constructor(private sidenavService: SidenavService, protected screenService: ScreenService) {}

  ngOnInit() {

    this.isMobile = this.screenService.isMobile();

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

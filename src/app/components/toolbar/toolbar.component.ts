import { Component } from '@angular/core';
import { SidenavService } from "../../services/sidenav.service";
import { MatToolbarModule} from "@angular/material/toolbar";
import { MatIconModule} from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatBadgeModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {


  constructor(private sidenavService: SidenavService) {}



  toggleMenu() {

      this.sidenavService.toggleSidenav();

  }

  displayCart() {

  }

}

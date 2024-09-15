import {Component} from '@angular/core';
import { SidenavService } from "../../services/sidenav.service";
import { MatToolbar } from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbar, MatIcon, MatButtonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {


  constructor(private sidenavService: SidenavService) {}



  toggleMenu() {

      this.sidenavService.toggleSidenav();

  }

}

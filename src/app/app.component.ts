import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from "@angular/common";
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    SidenavComponent,
    ToolbarComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'buy-nature-front';
}

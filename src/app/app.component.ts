import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";

@Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        SidenavComponent,
        ToolbarComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'buy-nature-front';
}

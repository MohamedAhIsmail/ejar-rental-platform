import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout-component',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent],
  templateUrl: './main-layout-component.component.html',
  styleUrls: ['./main-layout-component.component.css'],
})
export class MainLayoutComponentComponent {
  isSidebarCollapsed = false;

  onSidebarToggled(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}

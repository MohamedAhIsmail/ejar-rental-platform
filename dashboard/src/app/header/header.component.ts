import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private router: Router) {}

  @Input() isSidebarCollapsed = false;

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}

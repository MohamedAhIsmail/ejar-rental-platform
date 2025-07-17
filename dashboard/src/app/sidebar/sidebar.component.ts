import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  LogoImage = 'assets/images/logo.png';
  isCollapsed = false;
  isSmallScreen = window.innerWidth <= 768;

  @Output() sidebarToggled = new EventEmitter<boolean>();

  menuItems = [
    {
      path: '/statistics',
      label: 'Statistics',
      icon: 'fas fa-chart-bar',
    },
    {
      path: '/new-users',
      label: 'New Users',
      icon: 'fas fa-user-plus',
    },
    { path: '/users', label: 'Users', icon: 'fas fa-users' },
    {
      path: '/new-products',
      label: 'New Products',
      icon: 'fas fa-box-open',
    },
    { path: '/products', label: 'Products', icon: 'fas fa-boxes' },
    { path: '/processes', label: 'Processes', icon: 'fas fa-tasks' },
    { path: '/categories', label: 'Categories', icon: 'fas fa-tags' },
  ];

  constructor(private router: Router) {
    this.checkScreenSize();

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggled.emit(this.isCollapsed);
  }

  private checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 768;
  }


  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}

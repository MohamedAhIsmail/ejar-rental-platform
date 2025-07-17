import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],

  template: `
    <div class="text-center py-5 animate__animated animate__fadeIn">
      <div class="spinner-border text-primary" role="status" [ngStyle]="{ width: size, height: size }">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="mt-2 text-muted">{{ message }}</div>
    </div>
  `
})
export class LoaderComponent {
  @Input() size: string = '3rem';
  @Input() message: string = 'Loading...';
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="page-container">
      <h1>Dashboard</h1>
      <p>Your personalized widgets and quick actions will appear here.</p>
    </div>
  `,
  styles: [`
    .page-container {
      h1 {
        margin-bottom: 16px;
        font-size: 24px;
        font-weight: 600;
        color: var(--text-primary);
      }
      p {
        color: var(--text-secondary);
      }
    }
  `]
})
export class DashboardComponent {}

import { Component } from '@angular/core';

@Component({
  selector: 'app-module-store',
  standalone: true,
  template: `
    <div class="page-container">
      <h1>Module Store</h1>
      <p>Available modules will be displayed here.</p>
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
export class ModuleStoreComponent {}

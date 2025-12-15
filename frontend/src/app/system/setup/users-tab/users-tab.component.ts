import { Component } from '@angular/core';

@Component({
  selector: 'app-users-tab',
  standalone: true,
  template: `
    <div class="tab-panel">
      <div class="panel-header">
        <h2>Users</h2>
        <button class="btn-primary">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add User
        </button>
      </div>
      <div class="panel-content">
        <p class="placeholder-text">User management will be implemented here.</p>
      </div>
    </div>
  `,
  styles: [`
    .tab-panel {
      height: 100%;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h2 {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
      }
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: var(--primary-color);
      color: white;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;

      &:hover {
        background: var(--primary-dark);
      }
    }

    .panel-content {
      background: var(--background);
      border-radius: 6px;
      padding: 40px;
      text-align: center;
    }

    .placeholder-text {
      color: var(--text-secondary);
    }
  `]
})
export class UsersTabComponent {}

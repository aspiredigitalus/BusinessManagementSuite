import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div class="dialog-overlay" (click)="onCancel()">
      <div class="dialog" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>{{ title() }}</h3>
        </div>
        <div class="dialog-body">
          <p>{{ message() }}</p>
        </div>
        <div class="dialog-footer">
          <button class="btn-secondary" (click)="onCancel()">{{ cancelText() }}</button>
          <button class="btn-danger" (click)="onConfirm()">{{ confirmText() }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }

    .dialog {
      background: var(--surface);
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      min-width: 320px;
      max-width: 480px;
    }

    .dialog-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-color);

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
      }
    }

    .dialog-body {
      padding: 20px;

      p {
        margin: 0;
        color: var(--text-secondary);
        line-height: 1.5;
      }
    }

    .dialog-footer {
      padding: 12px 20px;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .btn-secondary {
      padding: 8px 16px;
      background: var(--background);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      transition: background 0.2s;

      &:hover {
        background: var(--hover-bg);
      }
    }

    .btn-danger {
      padding: 8px 16px;
      background: var(--error-color);
      color: white;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;

      &:hover {
        background: #b71c1c;
      }
    }
  `]
})
export class ConfirmDialogComponent {
  title = input<string>('Confirm');
  message = input<string>('Are you sure?');
  confirmText = input<string>('Confirm');
  cancelText = input<string>('Cancel');

  confirm = output<void>();
  cancel = output<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

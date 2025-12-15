import { Component, signal } from '@angular/core';
import { UsersTabComponent } from './users-tab/users-tab.component';
import { RolesTabComponent } from './roles-tab/roles-tab.component';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [UsersTabComponent, RolesTabComponent],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss'
})
export class SetupComponent {
  activeTab = signal('users');

  tabs: Tab[] = [
    {
      id: 'users',
      label: 'Users',
      icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
    },
    {
      id: 'roles',
      label: 'Roles',
      icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z'
    }
  ];

  setActiveTab(tabId: string): void {
    this.activeTab.set(tabId);
  }
}

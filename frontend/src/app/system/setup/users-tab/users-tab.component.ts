import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User, UserListItem } from '../../../core/models/user.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

interface UserFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-users-tab',
  standalone: true,
  imports: [FormsModule, ConfirmDialogComponent],
  templateUrl: './users-tab.component.html',
  styleUrl: './users-tab.component.scss'
})
export class UsersTabComponent implements OnInit {
  users = signal<UserListItem[]>([]);
  selectedUserId = signal<number | null>(null);
  isAddingNew = signal(false);
  isLoading = signal(false);
  isLoadingUser = signal(false);
  showCancelConfirm = signal(false);

  // Form fields
  formData = signal<UserFormData>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  originalFormData = signal<UserFormData | null>(null);

  hasChanges = computed(() => {
    const original = this.originalFormData();
    const current = this.formData();
    if (!original) return this.isAddingNew() && (
      current.username !== '' ||
      current.firstName !== '' ||
      current.lastName !== '' ||
      current.email !== ''
    );
    return (
      original.username !== current.username ||
      original.firstName !== current.firstName ||
      original.lastName !== current.lastName ||
      original.email !== current.email
    );
  });

  isFormValid = computed(() => {
    const data = this.formData();
    if (this.isAddingNew()) {
      return (
        data.username.trim() !== '' &&
        data.firstName.trim() !== '' &&
        data.lastName.trim() !== '' &&
        data.email.trim() !== '' &&
        data.password.trim() !== ''
      );
    }
    return (
      data.username.trim() !== '' &&
      data.firstName.trim() !== '' &&
      data.lastName.trim() !== '' &&
      data.email.trim() !== ''
    );
  });

  canSave = computed(() => this.isFormValid() && this.hasChanges());

  showForm = computed(() => this.selectedUserId() !== null || this.isAddingNew());

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  selectUser(userId: number): void {
    if (this.hasChanges()) {
      this.showCancelConfirm.set(true);
      return;
    }
    this.loadUserDetails(userId);
  }

  private loadUserDetails(userId: number): void {
    this.isAddingNew.set(false);
    this.selectedUserId.set(userId);
    this.isLoadingUser.set(true);

    this.userService.getUser(userId).subscribe({
      next: (user) => {
        const data = {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: ''
        };
        this.formData.set(data);
        this.originalFormData.set({ ...data });
        this.isLoadingUser.set(false);
      },
      error: () => {
        this.isLoadingUser.set(false);
      }
    });
  }

  onAddUser(): void {
    if (this.hasChanges()) {
      this.showCancelConfirm.set(true);
      return;
    }
    this.startAddingNew();
  }

  private startAddingNew(): void {
    this.selectedUserId.set(null);
    this.isAddingNew.set(true);
    const emptyForm = {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    };
    this.formData.set(emptyForm);
    this.originalFormData.set(null);
  }

  onSave(): void {
    if (!this.isFormValid()) return;

    const data = this.formData();

    if (this.isAddingNew()) {
      this.userService.createUser({
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      }).subscribe({
        next: (user) => {
          this.loadUsers();
          this.loadUserDetails(user.id);
        }
      });
    } else {
      const userId = this.selectedUserId();
      if (userId === null) return;

      this.userService.updateUser(userId, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
      }).subscribe({
        next: () => {
          this.loadUsers();
          this.originalFormData.set({ ...data });
        }
      });
    }
  }

  onCancel(): void {
    if (this.hasChanges()) {
      this.showCancelConfirm.set(true);
    } else {
      this.closeForm();
    }
  }

  onConfirmCancel(): void {
    this.showCancelConfirm.set(false);
    this.closeForm();
  }

  onCancelConfirm(): void {
    this.showCancelConfirm.set(false);
  }

  private closeForm(): void {
    this.selectedUserId.set(null);
    this.isAddingNew.set(false);
    this.formData.set({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    });
    this.originalFormData.set(null);
  }

  updateField(field: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.formData.update(data => ({
      ...data,
      [field]: value
    }));
  }
}

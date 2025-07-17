import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DatePipe],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  searchTerm = '';
  pageSize = 10;
  currentPage = 1;
  filterVerified = '';
  sortOption = 'name';
  filterRole = '';
  selectedUserIds: string[] = [];

  selectedUser: User | null = null;
  zoomedImageUrl = '';
  zoomedImageTitle = '';

  showEditModal = false;
  editingUser: User | null = null;
  editData = { userName: '', email: '' };

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  showTips = false;
  loading = true;

  showNoUsersModal = false;

  formErrors: { [key: string]: string } = {
    userName: '',
    email: '',
  };
  // For Delete Confirmation Modal
  confirmingDeleteUserId: string | null = null;

  showBulkDeleteConfirm = false;

  currentAdminId: string = '';
  confirmingToggleUserId: string | null = null;


  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.extractCurrentAdminId();
    this.loadUsers();
  }
  

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.users.filter((u) => u.isVerified); // Only verified by admin
        this.loading = false;
      },
      error: () => {
        this.showToastMessage('Failed to load users', 'error');
        this.loading = false;
      },
    });
  }
  

  filteredUsers(): User[] {
    let filtered = [...this.users];
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.userName.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.idNumber.includes(term)
      );
    }
    if (this.filterVerified === 'verified') {
      filtered = filtered.filter((user) => user.confirmEmail);
    } else if (this.filterVerified === 'unverified') {
      filtered = filtered.filter((user) => !user.confirmEmail);
    }
    if (this.filterRole === 'admin') {
      filtered = filtered.filter((user) => user.role === 'admin');
    } else if (this.filterRole === 'user') {
      filtered = filtered.filter((user) => user.role === 'user');
    }
    if (this.sortOption === 'name') {
      filtered.sort((a, b) => a.userName.localeCompare(b.userName));
    } else if (this.sortOption === 'newest') {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (this.sortOption === 'oldest') {
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
    return filtered;
  }

  paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers().slice(start, start + this.pageSize);
  }

  toggleUserSelection(id: string) {
    if (id === this.currentAdminId) return; // prevent selecting yourself
    this.selectedUserIds.includes(id)
      ? (this.selectedUserIds = this.selectedUserIds.filter(
          (uid) => uid !== id
        ))
      : this.selectedUserIds.push(id);
  }

  toggleAllUsers(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const filteredIds = this.filteredUsers()
      .map((u) => u._id)
      .filter((id) => id !== this.currentAdminId);
    if (checked && filteredIds.length === 0) {
      this.showToastMessage(
        'No selectable users & (you cannot select yourself).',
        'error'
      );
    }
    this.selectedUserIds = checked ? filteredIds : [];
  }

  openIdImages(user: User) {
    this.selectedUser = user;
  }

  closeIdImagesModal() {
    this.selectedUser = null;
  }

  openZoomModal(src: string, title: string) {
    this.zoomedImageUrl = src;
    this.zoomedImageTitle = title;
  }

  closeZoomModal() {
    this.zoomedImageUrl = '';
    this.zoomedImageTitle = '';
  }

  cancelDelete() {
    this.confirmingDeleteUserId = null;
  }

  proceedDelete() {
    if (!this.confirmingDeleteUserId) return;
    if (this.confirmingDeleteUserId === this.currentAdminId) {
      this.showToastMessage(
        "You can't delete yourself from here. Please contact another admin.",
        'error'
      );
      this.confirmingDeleteUserId = null;
      return;
    }
    this.userService.deleteUser(this.confirmingDeleteUserId).subscribe({
      next: () => {
        this.users = this.users.filter(
          (u) => u._id !== this.confirmingDeleteUserId
        );
        this.confirmingDeleteUserId = null;
        this.showToastMessage('User deleted successfully');
      },
      error: () => {
        this.confirmingDeleteUserId = null;
        this.showToastMessage('Failed to delete user', 'error');
      },
    });
  }

  deleteUser(id: string) {
    if (id === this.currentAdminId) {
      this.showToastMessage("You can't delete yourself.", 'error');
      return;
    }
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u._id !== id);
        this.showToastMessage('User deleted successfully');
      },
      error: () => this.showToastMessage('Failed to delete user', 'error'),
    });
  }

  bulkDeleteUsers() {
    this.showBulkDeleteConfirm = true;
  }

  proceedBulkDelete() {
    if (this.selectedUserIds.includes(this.currentAdminId)) {
      this.showToastMessage(
        "You can't bulk delete yourself. Deselect yourself first.",
        'error'
      );
      this.showBulkDeleteConfirm = false;
      return;
    }
    const ids = [...this.selectedUserIds];
    ids.forEach((id) => {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter((u) => !ids.includes(u._id));
          this.showToastMessage('Selected users deleted successfully');
        },
        error: () =>
          this.showToastMessage('Error deleting selected users', 'error'),
      });
    });
    this.selectedUserIds = [];
    this.showBulkDeleteConfirm = false;
  }

  cancelBulkDelete() {
    this.showBulkDeleteConfirm = false;
  }
  openToggleModal(userId: string) {
    this.confirmingToggleUserId = userId;
  }
  
  cancelToggleVerification() {
    this.confirmingToggleUserId = null;
  }
  
  confirmToggleVerification() {
    const user = this.users.find(u => u._id === this.confirmingToggleUserId);
    if (!user) return;
  
    if (user._id === this.currentAdminId) {
      this.showToastMessage("You can't ban yourself.", 'error');
      this.cancelToggleVerification();
      return;
    }
  
    this.userService.toggleVerification(user._id).subscribe({
      next: (res) => {
        user.isVerified = res.isVerified;
        this.showToastMessage(`User has been ${res.isVerified ? 're-verified' : 'banned'}`, 'success');
        if (!res.isVerified) {
          this.users = this.users.filter(u => u._id !== user._id);
        }
        this.cancelToggleVerification();
      },
      error: () => {
        this.showToastMessage('Failed to update verification status', 'error');
        this.cancelToggleVerification();
      }
    });
  }
  

  openEditModal(user: User) {
    this.editingUser = user;
    this.editData = {
      userName: user.userName,
      email: user.email,
    };
    this.formErrors = {};
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingUser = null;
  }

  validateField(field: 'userName' | 'email') {
    const value = this.editData[field].trim();
    if (field === 'userName') {
      if (!value) {
        this.formErrors['userName'] = 'Username is required';
      } else if (value.length < 3) {
        this.formErrors['userName'] = 'Username must be at least 3 characters';
      } else if (value.length > 30) {
        this.formErrors['userName'] = 'Username cannot exceed 30 characters';
      } else if (!/^[a-zA-Z_ ]+$/.test(value)) {
        this.formErrors['userName'] =
          'Username must only contain letters, underscores, and spaces';
      } else {
        this.formErrors['userName'] = '';
      }
    }
    if (field === 'email') {
      if (!value) this.formErrors['email'] = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        this.formErrors['email'] = 'Enter a valid email';
      else this.formErrors['email'] = '';
    }
  }

  updateUser() {
    this.validateField('userName');
    this.validateField('email');
    if (this.formErrors['userName'] || this.formErrors['email']) {
      return this.showToastMessage('Please fix the validation errors', 'error');
    }
    if (!this.editingUser) return;
    this.userService.updateUser(this.editingUser._id, this.editData).subscribe({
      next: (res) => {
        const updated = res.user;
        this.users = this.users.map((u) =>
          u._id === updated._id ? updated : u
        );
        this.closeEditModal();
        this.showToastMessage('User updated successfully');
      },
      error: () => this.showToastMessage('Failed to update user', 'error'),
    });
  }

  exportToCSV() {
    const rows = this.filteredUsers().map((u) => ({
      Name: u.userName,
      Email: u.email,
      ID: u.idNumber,
      Verified: u.confirmEmail ? 'Yes' : 'No',
      Role: u.role,
      Created: new Date(u.createdAt).toLocaleDateString(),
    }));

    if (!rows.length) {
      this.showNoUsersModal = true;
      return;
    }

    const csv = [
      Object.keys(rows[0]).join(','),
      ...rows.map((row) => Object.values(row).join(',')),
    ].join('\n');

    const csvWithBom = '\uFEFF' + csv;
    const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.setAttribute('download', 'users.csv');
    a.click();
  }

  totalPages(): number {
    return Math.ceil(this.filteredUsers().length / this.pageSize);
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  getShowingCount(): number {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return Math.min(end, this.filteredUsers().length);
  }

  showToastMessage(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
  }

  getProfilePictureUrl(path: string | null | undefined): string {
  const defaultUrl = 'https://static.vecteezy.com/system/resources/previews/026/619/142/non_2x/default-avatar-profile-icon-of-social-media-user-photo-image-vector.jpg';
  return path && path !== 'undefined' ? path : defaultUrl;
}


  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src =
      'https://static.vecteezy.com/system/resources/previews/026/619/142/non_2x/default-avatar-profile-icon-of-social-media-user-photo-image-vector.jpg';
  }

  extractCurrentAdminId() {
    const token =
      localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.currentAdminId = decoded.id;
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    }
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { ShortIdPipe } from '../pipes/short-id.pipe';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, ShortIdPipe],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class AllCategoriesComponent implements OnInit {
  categories = signal<any[]>([]);
  newCategory = signal<{ name: string; icon: string }>({ name: '', icon: '' });
  editCategory = signal<any | null>(null);
  showAddModal = signal<boolean>(false);
  showEditModal = signal<boolean>(false);
  showIconDropdown = signal<boolean>(false);
  loading = signal<boolean>(true);

  searchTerm = '';
  pageSize = 10;
  currentPage = 1;
  sortOption = 'name';
  selectedCategoryIds: string[] = [];

  confirmingDeleteCategoryId: string | null = null;
  showBulkDeleteConfirm = false;
  showNoCategoriesModal = false;

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  showTips = false;

  formErrors: { [key: string]: string } = {
    name: '',
    icon: '',
  };

  availableIcons = [
    { value: 'fa-home', label: 'Home' },
    { value: 'fa-building', label: 'Building' },
    { value: 'fa-laptop', label: 'Laptop' },
    { value: 'fa-computer', label: 'Computer' },
    { value: 'fa-desktop', label: 'Desktop' },
    { value: 'fa-tv', label: 'Tv' },
    { value: 'fa-camera', label: 'Camera' },
    { value: 'fa-gamepad', label: 'Gamepad' },
    { value: 'fa-car', label: 'Car' },
    { value: 'fa-bicycle', label: 'Bicycle' },
    { value: 'fa-bed', label: 'Bed' },
    { value: 'fa-chair', label: 'Chair' },
    { value: 'fa-shirt', label: 'Shirt' },
    { value: 'fa-kitchen-set', label: 'Kitchen set' },
    { value: 'fa-screwdriver-wrench', label: 'Screwdriver wrench' },
    { value: 'fa-baseball-bat-ball', label: 'Baseball bat' },
    { value: 'fa-table-tennis-paddle-ball', label: 'Table tennis' },
    { value: 'fa-handshake', label: 'Handshake' },
    { value: 'fa-fire', label: 'Fire' },
    { value: 'fa-icons', label: 'Icons' },
    { value: 'fa-dumbbell', label: 'Dumbbell' },
    { value: 'fa-mobile-alt', label: 'Mobile' },
    { value: 'fa-music', label: 'Music' },
    { value: 'fa-headphones', label: 'Headphones' },
    { value: 'fa-video', label: 'Video' },
    { value: 'fa-volume-high', label: 'Volume' },
    { value: 'fa-microphone', label: 'Mic' },
    { value: 'fa-baby', label: 'Baby' },
    { value: 'fa-baby-carriage', label: 'Baby carriage' },
    { value: 'fa-paw', label: 'Paw' },
    { value: 'fa-book', label: 'Book' },
  ];

  constructor(
    private categoryService: CategoryService,
  ) {}

  get selectedIconLabelAdd(): string {
    const selectedIcon = this.availableIcons.find(
      (icon) => icon.value === this.newCategory().icon
    );
    return selectedIcon ? selectedIcon.label : 'Select an icon';
  }

  get selectedIconLabelEdit(): string {
    const selectedIcon = this.availableIcons.find(
      (icon) => icon.value === this.editCategory()?.icon
    );
    return selectedIcon ? selectedIcon.label : 'Select an icon';
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading.set(true);
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.categories.set([]);
        this.showToastMessage('Failed to load categories', 'error');
        this.loading.set(false);
      },
    });
  }

  filteredCategories(): any[] {
    let filtered = [...this.categories()];
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(term) ||
          category._id.toLowerCase().includes(term)
      );
    }
    if (this.sortOption === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortOption === 'newest') {
      filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (this.sortOption === 'oldest') {
      filtered.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
    return filtered;
  }

  paginatedCategories(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCategories().slice(start, start + this.pageSize);
  }

  toggleCategorySelection(id: string) {
    this.selectedCategoryIds.includes(id)
      ? (this.selectedCategoryIds = this.selectedCategoryIds.filter((cid) => cid !== id))
      : this.selectedCategoryIds.push(id);
  }

  toggleAllCategories(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedCategoryIds = checked
      ? this.filteredCategories().map((c) => c._id)
      : [];
  }

  openAddModal() {
    this.newCategory.set({ name: '', icon: '' });
    this.showAddModal.set(true);
    this.showIconDropdown.set(false);
    this.formErrors = {};
  }

  closeAddModal() {
    this.showAddModal.set(false);
    this.showIconDropdown.set(false);
  }

  openEditModal(category: any) {
    this.editCategory.set({ ...category });
    this.showEditModal.set(true);
    this.showIconDropdown.set(false);
    this.formErrors = {};
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editCategory.set(null);
    this.showIconDropdown.set(false);
  }

  toggleIconDropdown() {
    this.showIconDropdown.set(!this.showIconDropdown());
  }

  selectIcon(icon: string, isAddModal: boolean) {
    if (isAddModal) {
      this.newCategory.update((current) => ({ ...current, icon }));
    } else {
      this.editCategory.update((current) => ({ ...current, icon }));
    }
    this.showIconDropdown.set(false);
    this.validateField('icon', isAddModal);
  }

  validateField(field: 'name' | 'icon', isAddModal: boolean) {
    const category = isAddModal ? this.newCategory() : this.editCategory();
    if (!category) return;

    if (field === 'name') {
      if (!category.name || category.name.trim().length < 3) {
        this.formErrors['name'] = 'Category name must be at least 3 characters';
      } else if (category.name.trim().length > 15) {
        this.formErrors['name'] = 'Category name cannot exceed 15 characters';
      } else if (!/^[a-zA-Z\s]+$/.test(category.name.trim())) {
        this.formErrors['name'] = 'Category name must contain only English letters and spaces';
      } else {
        this.formErrors['name'] = '';
      }
    }

    if (field === 'icon') {
      if (!category.icon) {
        this.formErrors['icon'] = 'Category icon is required';
      } else {
        this.formErrors['icon'] = '';
      }
    }
  }

  addCategory() {
    this.validateField('name', true);
    this.validateField('icon', true);
    if (Object.values(this.formErrors).some((error) => error)) {
      this.showToastMessage('Please check fields', 'error');
      return;
    }
    const category = this.newCategory();
    this.categoryService.addCategory(category).subscribe({
      next: () => {
        this.loadCategories();
        this.closeAddModal();
        this.showToastMessage('Category added successfully');
      },
      error: (err) => {
        const message = err?.error?.message || 'Error adding category';
        this.showToastMessage(message, 'error');
      },
    });
  }

  updateCategory() {
    this.validateField('name', false);
    this.validateField('icon', false);
    if (Object.values(this.formErrors).some((error) => error)) {
      this.showToastMessage('Please check fields', 'error');
      return;
    }
    const category = this.editCategory();
    if (!category) return;
    this.categoryService
      .updateCategory(category._id, { name: category.name, icon: category.icon })
      .subscribe({
        next: () => {
          this.loadCategories();
          this.closeEditModal();
          this.showToastMessage('Category updated successfully');
        },
        error: (err) => {
          const message = err?.error?.message || 'Error updating category';
          this.showToastMessage(message, 'error');
        },
      });
  }

  cancelDelete() {
    this.confirmingDeleteCategoryId = null;
  }

  proceedDelete() {
    if (!this.confirmingDeleteCategoryId) return;
    this.categoryService.deleteCategory(this.confirmingDeleteCategoryId).subscribe({
      next: () => {
        this.categories.set(
          this.categories().filter((c) => c._id !== this.confirmingDeleteCategoryId)
        );
        this.confirmingDeleteCategoryId = null;
        this.showToastMessage('Category deleted successfully');
      },
      error: () => {
        this.confirmingDeleteCategoryId = null;
        this.showToastMessage('Error deleting category', 'error');
      },
    });
  }

  bulkDeleteCategories() {
    this.showBulkDeleteConfirm = true;
  }

  proceedBulkDelete() {
    const ids = [...this.selectedCategoryIds];
    ids.forEach((id) => {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.categories.set(this.categories().filter((c) => !ids.includes(c._id)));
          this.showToastMessage('Selected categories deleted successfully');
        },
        error: () => this.showToastMessage('Error deleting selected categories', 'error'),
      });
    });
    this.selectedCategoryIds = [];
    this.showBulkDeleteConfirm = false;
  }

  cancelBulkDelete() {
    this.showBulkDeleteConfirm = false;
  }

  exportToCSV() {
    const rows = this.filteredCategories().map((c) => ({
      ID: c._id,
      Name: c.name,
      Icon: c.icon,
      'Created At': new Date(c.createdAt).toLocaleDateString(),
    }));

    if (!rows.length) {
      this.showNoCategoriesModal = true;
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
    a.setAttribute('download', 'categories.csv');
    a.click();
  }

  totalPages(): number {
    return Math.ceil(this.filteredCategories().length / this.pageSize);
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  getShowingCount(): number {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return Math.min(end, this.filteredCategories().length);
  }

  showToastMessage(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
  }
}

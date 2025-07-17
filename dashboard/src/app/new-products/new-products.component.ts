import { ProductService } from './../services/product.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { LoaderComponent } from '../loader/loader.component';
import { CategoryService } from '../services/category.service';
import { ShortIdPipe } from '../pipes/short-id.pipe';

import { FormsModule } from '@angular/forms';
import { Product } from '../models/product.interface';

@Component({
  selector: 'app-new-products',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, ShortIdPipe],
  templateUrl: './new-products.component.html',
  styleUrl: './new-products.component.css',
})
export class NewProductsComponent implements OnInit {
  constructor(private _ProductService: ProductService ,
    private categoryService: CategoryService) {}

  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  loading = signal<boolean>(true);

  searchTerm = '';
  pageSize = 10;
  currentPage = 1;
  filterStatus = '';
  sortOption = 'name';
  selectedProductIds: string[] = [];

  showEditModal = signal<boolean>(false);
  editProduct = signal<any | null>(null);
  formErrors: { [key: string]: string } = {};

  confirmingDeleteProductId: string | null = null;
  showBulkDeleteConfirm = false;
  showNoProductsModal = false;

  zoomedImages: string[] = [];
  zoomedImageTitle = '';
  mainImage = '';

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  showTips = false;



  ngOnInit() {
    this.loadProducts();
  }



  loadProducts() {
    this.loading.set(true);
    this._ProductService.getallProducts().subscribe({
      next: (res) => {
        const confirmed = res.data.filter((item :Product) => item.confirmed === false);
        this.products.set(confirmed);
        
        this.loading.set(false);
      },
      error: () => {
        this.showToastMessage('Failed to load products', 'error');
        this.loading.set(false);
      },
    });
  }

  filteredProducts() {
    let filtered = [...this.products()];
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.renterId.userName.toLowerCase().includes(term) ||
          p.status.toLowerCase().includes(term)
      );
    }
    if (this.filterStatus) {
      filtered = filtered.filter((p) => p.status === this.filterStatus);
    }
    if (this.sortOption === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortOption === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (this.sortOption === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    return filtered;
  }

  paginatedProducts() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  }

  toggleProductSelection(id: string) {
    this.selectedProductIds.includes(id)
      ? (this.selectedProductIds = this.selectedProductIds.filter((pid) => pid !== id))
      : this.selectedProductIds.push(id);
  }

  toggleAllProducts(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedProductIds = checked ? this.filteredProducts().map((p) => p._id) : [];
  }

  openEditModal(product: any) {
    this.editProduct.set({ ...product });
    this.showEditModal.set(true);
    this.formErrors = {};
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editProduct.set(null);
  }

  validateField(field: string) {
    const product = this.editProduct();
    if (!product) return;

    const arabicRegex = /[\u0600-\u06FF]/;
    if (field === 'name') {
      if (!product.name) this.formErrors['name'] = 'Title is required';
      else if (product.name.length > 29) this.formErrors['name'] = 'Title must be at most 29 characters';
      else if (arabicRegex.test(product.name)) this.formErrors['name'] = 'No Arabic characters allowed';
      else delete this.formErrors['name'];
    }
    if (field === 'description') {
      if (!product.description) this.formErrors['description'] = 'Description is required';
      else delete this.formErrors['description'];
    }
    if (field === 'category') {
      if (!product.category._id) this.formErrors['category'] = 'Category is required';
      else delete this.formErrors['category'];
    }
    if (field === 'status') {
      if (!product.status) this.formErrors['status'] = 'Status is required';
      else delete this.formErrors['status'];
    }
    if (field === 'price') {
      if (!product.daily || product.daily <= 0) this.formErrors['price'] = 'Price must be greater than 0';
      else delete this.formErrors['price'];
    }
  }

  updateProduct() {
    const product = this.editProduct();
    if (!product) return;

    this.validateField('name');
    this.validateField('description');
    this.validateField('category');
    this.validateField('status');
    this.validateField('price');

    if (Object.keys(this.formErrors).length) {
      this.showToastMessage('Please check fields', 'error');
      return;
    }

    const updatedData = {
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category._id,
      status: product.status,
      daily: product.daily,
      images: product.images,
    };


    this._ProductService.updateProduct(updatedData).subscribe({
      next: (response) => {
        this.loadProducts();
        this.closeEditModal();
        this.showToastMessage('Product updated successfully');
      },
      error: (err) => {
        console.error('Update error:', err);
        this.showToastMessage(err?.error?.message || 'Error updating product', 'error');
      },
    });
  }

  cancelDelete() {
    this.confirmingDeleteProductId = null;
  }

  proceedDelete() {
    if (!this.confirmingDeleteProductId) return;
    this._ProductService.removeProduct(this.confirmingDeleteProductId).subscribe({
      next: () => {
        this.products.set(this.products().filter((p) => p._id !== this.confirmingDeleteProductId));
        this.confirmingDeleteProductId = null;
        this.showToastMessage('Product deleted successfully');
      },
      error: () => {
        this.showToastMessage('Error deleting product', 'error');
        this.confirmingDeleteProductId = null;
      },
    });
  }

  bulkDeleteProducts() {
    this.showBulkDeleteConfirm = true;
  }

  proceedBulkDelete() {
    const ids = [...this.selectedProductIds];
    ids.forEach((id) => {
      this._ProductService.removeProduct(id).subscribe({
        next: () => {
          this.products.set(this.products().filter((p) => !ids.includes(p._id)));
          this.showToastMessage('Selected products deleted successfully');
        },
        error: () => this.showToastMessage('Error deleting selected products', 'error'),
      });
    });
    this.selectedProductIds = [];
    this.showBulkDeleteConfirm = false;
  }

  cancelBulkDelete() {
    this.showBulkDeleteConfirm = false;
  }

  exportToCSV() {
    const rows = this.filteredProducts().map((p) => ({
      'Product ID': p._id,
      Name: p.name,
      Category: p.category.name,
      Status: p.status,
      Owner: p.renterId.userName,
      'Daily Price': `${p.daily} EGP`,
      'Created At': new Date(p.createdAt).toLocaleDateString(),
    }));

    if (!rows.length) {
      this.showNoProductsModal = true;
      return;
    }

    const csv = [Object.keys(rows[0]).join(','), ...rows.map((row) => Object.values(row).join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.setAttribute('download', 'products.csv');
    a.click();
  }

  totalPages() {
    return Math.ceil(this.filteredProducts().length / this.pageSize);
  }

  totalPagesArray() {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  getShowingCount() {
    const start = (this.currentPage - 1) * this.pageSize;
    return Math.min(start + this.pageSize, this.filteredProducts().length);
  }

  openZoomModal(images: string[], title: string) {
    this.zoomedImages = images.length ? images : ['assets/placeholder-image.jpg'];
    this.zoomedImageTitle = title;
    this.mainImage = this.zoomedImages[0];
  }

  closeZoomModal() {
    this.zoomedImages = [];
    this.zoomedImageTitle = '';
    this.mainImage = '';
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/placeholder-image.jpg';
  }

  showToastMessage(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
  }

  users: any[] = [];
  newusers: any[] = [];
  paginatedUsers: any[] = [];

  pageIndex: number = 0;


  showRejectInput: boolean = false;
  rejectReason: string = '';

  @Input() product: any;

  confirmProduct() {
   

    const updatedData = {
      ...this.selectedProduct,
      confirmed: true,
      confirmMessage: 'Product confirmed by admin',
      status: 'available',
    };
   

    this._ProductService.updateProduct(updatedData).subscribe({
      next: () => {
        this.closeModal();
        this.ngOnInit();
      },
      error: (err) => console.error('Error confirming product:', err),
    });
  }

  rejectProduct() {
    if (!this.rejectReason.trim()) return;

    const updatedData = {
      ...this.selectedProduct,
      confirmed: false,
      confirmMessage: this.rejectReason,
    };

    this._ProductService.updateProduct(updatedData).subscribe({
      next: () => {
        this.showRejectInput = false;
        this.rejectReason = '';
      },
      error: (err) => console.error('Error rejecting product:', err),
    });
  }

 

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.newusers.slice(startIndex, endIndex);
  }

  remove(id: string) {
    this._ProductService.removeProduct(id).subscribe({
      next: (res) => {
        this.pageIndex = 0;
        this.ngOnInit();
      },
    });
  }

  move(id: number) {
    window.location.href = `http://localhost:5173/product/${id}`;
  }
  profile(id: number) {
    window.open(`http://localhost:5173/profile/${id}`, '_blank');
  }

  trackById(index: number, item: any) {
    return item.id;
  }
  closeModal() {
    this.selectedProduct = null;
  }

  selectedProduct: any = null;

  isEditing: boolean = false;
  isOwner: boolean = false;

  openProductModal(product: any, currentUserId: string) {
    this.selectedProduct = product;

    this.mainImage = product.images[0];
    this.isEditing = false;
    this.isOwner = product.renterId?._id === currentUserId;
  }

  closeProductModal() {
    this.selectedProduct = null;
    this.mainImage = '';
    this.isEditing = false;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    // You can add save logic here when saving
  }
}

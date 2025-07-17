import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcessService } from '../services/process.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-process',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.css'],
})
export class AllProcessComponent implements OnInit {
  processes = signal<any[]>([]);
  loading = signal(true);

  searchTerm = '';
  pageSize = 10;
  currentPage = 1;
  filterStatus = '';
  sortOption = 'productName';
  selectedProcessIds: string[] = [];

  showEditModal = signal(false);
  editProcess = signal<any | null>(null);
  formErrors: { [key: string]: string } = {
    startDate: '',
    endDate: '',
    status: '',
    price: '',
  };

  confirmingDeleteProcessId: string | null = null;
  showBulkDeleteConfirm = false;
  showNoProcessesModal = false;

  zoomedImages: string[] = [];
  zoomedImageTitle = '';
  mainImage = '';
  imageErrors: { [key: string]: boolean } = {};

  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  showTips = false;

  constructor(
    private processService: ProcessService,
  ) {}

  ngOnInit() {
    this.loadProcesses();
  }

  loadProcesses() {
    this.loading.set(true);
    this.processService.getAllProcesses().subscribe({
      next: (data) => {
        this.processes.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.showToastMessage('Failed to load processes', 'error');
        this.loading.set(false);
      },
    });
  }

  filteredProcesses(): any[] {
    let filtered = [...this.processes()].filter(
      (process) => process.productId
    );

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (process) =>
          (process.productId.name?.toLowerCase()?.includes(term) || '') ||
          (process.productId.renterId?.userName?.toLowerCase()?.includes(term) || '') ||
          process.status.toLowerCase().includes(term)
      );
    }
    if (this.filterStatus) {
      filtered = filtered.filter((process) => process.status === this.filterStatus);
    }
    if (this.sortOption === 'productName') {
      filtered.sort((a, b) =>
        (a.productId.name || '').localeCompare(b.productId.name || '')
      );
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

  paginatedProcesses(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProcesses().slice(start, start + this.pageSize);
  }

  toggleProcessSelection(id: string) {
    this.selectedProcessIds.includes(id)
      ? (this.selectedProcessIds = this.selectedProcessIds.filter((pid) => pid !== id))
      : this.selectedProcessIds.push(id);
  }

  toggleAllProcesses(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedProcessIds = checked
      ? this.filteredProcesses().map((p) => p._id)
      : [];
  }

  openEditModal(process: any) {
    this.editProcess.set({
      ...process,
      startDate: new Date(process.startDate).toISOString().split('T')[0],
      endDate: new Date(process.endDate).toISOString().split('T')[0],
    });
    this.formErrors = {};
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editProcess.set(null);
  }

  validateField(field: 'startDate' | 'endDate' | 'status' | 'price') {
    const process = this.editProcess();
    if (!process) return;
    const value = process[field];

    if (field === 'startDate') {
      if (!value) {
        this.formErrors[field] = 'Start Date is required';
      } else {
        const startDate = new Date(value);
        const now = new Date();
        if (startDate <= now) {
          this.formErrors[field] = 'Start Date must be in the future';
        } else {
          this.formErrors[field] = '';
        }
      }
    }

    if (field === 'endDate') {
      if (!value) {
        this.formErrors[field] = 'End Date is required';
      } else {
        const endDate = new Date(value);
        const startDate = process.startDate ? new Date(process.startDate) : null;
        if (startDate && endDate <= startDate) {
          this.formErrors[field] = 'End Date must be after Start Date';
        } else {
          this.formErrors[field] = '';
        }
      }
    }

    if (field === 'status') {
      if (!value) {
        this.formErrors['status'] = 'Status is required';
      } else {
        this.formErrors['status'] = '';
      }
    }

    if (field === 'price') {
      if (!value || value <= 0) {
        this.formErrors['price'] = 'Price must be greater than 0';
      } else {
        this.formErrors['price'] = '';
      }
    }
  }

  updateProcess() {
    const process = this.editProcess();
    if (!process) return;
    this.validateField('startDate');
    this.validateField('endDate');
    this.validateField('status');
    this.validateField('price');
    if (Object.values(this.formErrors).some((error) => error)) {
      this.showToastMessage('Please check fields', 'error');
      return;
    }
    const updatedProcess = {
      productId: process.productId._id,
      renterId: process.renterId,
      startDate: new Date(process.startDate).toISOString(),
      endDate: new Date(process.endDate).toISOString(),
      status: process.status,
      price: process.price,
    };
    this.processService.updateProcess(process._id, updatedProcess).subscribe({
      next: () => {
        this.loadProcesses();
        this.closeEditModal();
        this.showToastMessage('Process updated successfully');
      },
      error: () => this.showToastMessage('Failed to update process', 'error'),
    });
  }

  cancelDelete() {
    this.confirmingDeleteProcessId = null;
  }

  proceedDelete() {
    if (!this.confirmingDeleteProcessId) return;
    this.processService.deleteProcess(this.confirmingDeleteProcessId).subscribe({
      next: () => {
        this.processes.set(this.processes().filter((p) => p._id !== this.confirmingDeleteProcessId));
        this.confirmingDeleteProcessId = null;
        this.showToastMessage('Process deleted successfully');
      },
      error: () => {
        this.confirmingDeleteProcessId = null;
        this.showToastMessage('Failed to delete process', 'error');
      },
    });
  }

  bulkDeleteProcesses() {
    this.showBulkDeleteConfirm = true;
  }

  proceedBulkDelete() {
    const ids = [...this.selectedProcessIds];
    ids.forEach((id) => {
      this.processService.deleteProcess(id).subscribe({
        next: () => {
          this.processes.set(this.processes().filter((p) => !ids.includes(p._id)));
          this.showToastMessage('Selected processes deleted successfully');
        },
        error: () => this.showToastMessage('Error deleting selected processes', 'error'),
      });
    });
    this.selectedProcessIds = [];
    this.showBulkDeleteConfirm = false;
  }

  cancelBulkDelete() {
    this.showBulkDeleteConfirm = false;
  }

  exportToCSV() {
    const rows = this.filteredProcesses().map((p) => ({
      'Product Name': p.productId.name || 'N/A',
      'Renter Name': p.productId.renterId?.userName || 'N/A',
      'Start Date': new Date(p.startDate).toLocaleDateString(),
      'End Date': new Date(p.endDate).toLocaleDateString(),
      Status: p.status,
      Price: `${p.price} EGP`,
      'Created At': new Date(p.createdAt).toLocaleDateString(),
    }));

    if (!rows.length) {
      this.showNoProcessesModal = true;
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
    a.setAttribute('download', 'processes.csv');
    a.click();
  }

  totalPages(): number {
    return Math.ceil(this.filteredProcesses().length / this.pageSize);
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  getShowingCount(): number {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return Math.min(end, this.filteredProcesses().length);
  }

  openZoomModal(images: string[], title: string) {
    this.zoomedImages = images.length ? images : [''];
    this.zoomedImageTitle = title;
    this.mainImage = this.zoomedImages[0];
  }

  closeZoomModal() {
    this.zoomedImages = [];
    this.zoomedImageTitle = '';
    this.mainImage = '';
  }

  onImageError(event: Event, processId?: string) {
    if (processId) {
      this.imageErrors[processId] = true;
    }
    (event.target as HTMLImageElement).style.display = 'none';
  }

  showToastMessage(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
  }
}

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-left">
          <h1 class="title">📦 Gestión de Productos</h1>
          <p class="subtitle">Administra tu inventario de productos</p>
        </div>
        <div class="header-right">
          <button class="btn-primary" routerLink="/agregar">
            <span class="icon">+</span> Nuevo Producto
          </button>
        </div>
      </header>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ products().length }}</span>
            <span class="stat-label">Total Productos</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ activeProducts() }}</span>
            <span class="stat-label">Activos</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ currentYear }}</span>
            <span class="stat-label">Este Año</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ currentTime }}</span>
            <span class="stat-label">Hora Actual</span>
          </div>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="filters-section">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            [(ngModel)]="searchText"
            (input)="filterProducts()"
            class="search-input"
          />
          @if (searchText) {
            <button class="clear-search" (click)="clearSearch()">✕</button>
          }
        </div>
        
        <div class="filter-group">
          <select [(ngModel)]="itemsPerPage" (change)="onItemsPerPageChange()" class="filter-select">
            <option [value]="5">5 por página</option>
            <option [value]="10">10 por página</option>
            <option [value]="20">20 por página</option>
            <option [value]="50">50 por página</option>
          </select>
        </div>
      </div>

      <!-- Products Table -->
      <div class="products-table-wrapper">
        @if (loading()) {
          <div class="loading-skeleton">
            @for (i of [1,2,3,4,5]; track i) {
              <div class="skeleton-row">
                <div class="skeleton"></div>
                <div class="skeleton"></div>
                <div class="skeleton"></div>
                <div class="skeleton"></div>
                <div class="skeleton"></div>
              </div>
            }
          </div>
        } @else if (filteredProducts().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <h3>No se encontraron productos</h3>
            <p>{{ searchText ? 'Intenta con otros términos de búsqueda' : 'Agrega tu primer producto' }}</p>
            @if (!searchText) {
              <button class="btn-primary" routerLink="/agregar">Agregar Producto</button>
            }
          </div>
        } @else {
          <table class="products-table">
            <thead>
              <tr>
                <th class="th-logo">Logo</th>
                <th class="th-name">Producto</th>
                <th class="th-desc">Descripción</th>
                <th class="th-date">Liberación</th>
                <th class="th-date">Revisión</th>
                <th class="th-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (product of paginatedProducts(); track product.id; let i = $index) {
                <tr class="product-row" [style.animation-delay]="i * 50 + 'ms'">
                  <td class="td-logo">
                    <img [src]="product.logo" [alt]="product.name" class="product-logo" 
                         (error)="onImageError($event)"/>
                  </td>
                  <td class="td-name">
                    <span class="product-name">{{ product.name }}</span>
                    <span class="product-id">ID: {{ product.id }}</span>
                  </td>
                  <td class="td-desc">
                    <span class="product-desc">{{ product.description }}</span>
                  </td>
                  <td class="td-date">
                    <span class="date-badge">{{ product.date_release | date:'dd/MM/yyyy' }}</span>
                  </td>
                  <td class="td-date">
                    <span class="date-badge warning">{{ product.date_revision | date:'dd/MM/yyyy' }}</span>
                  </td>
                  <td class="td-actions">
                    <div class="action-buttons">
                      <button class="btn-action edit" (click)="editarProducto(product)" title="Editar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button class="btn-action delete" (click)="mostrarModalEliminar(product)" title="Eliminar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>

      <!-- Pagination -->
      @if (filteredProducts().length > 0) {
        <div class="pagination">
          <span class="pagination-info">
            Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ filteredProducts().length }} productos
          </span>
          <div class="pagination-buttons">
            <button class="btn-pagination" (click)="prevPage()" [disabled]="currentPage === 1">
              ← Anterior
            </button>
            @for (page of getVisiblePages(); track page) {
              <button 
                class="btn-pagination" 
                [class.active]="page === currentPage"
                (click)="goToPage(page)"
              >
                {{ page }}
              </button>
            }
            <button class="btn-pagination" (click)="nextPage()" [disabled]="currentPage === totalPages()">
              Siguiente →
            </button>
          </div>
        </div>
      }

      <!-- Delete Modal -->
      @if (productoAEliminar) {
        <div class="modal-backdrop" (click)="cancelarEliminar()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-icon delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro de eliminar el producto <strong>{{ productoAEliminar.name }}</strong>?</p>
            <p class="modal-warning">Esta acción no se puede deshacer.</p>
            <div class="modal-actions">
              <button class="btn-secondary" (click)="cancelarEliminar()">Cancelar</button>
              <button class="btn-danger" (click)="confirmarEliminar()">Eliminar</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      padding: 2rem;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
    }

    /* Header */
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .title {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
      animation: titleGlow 3s ease-in-out infinite;
    }

    @keyframes titleGlow {
      0%, 100% { filter: brightness(1); }
      50% { filter: brightness(1.2); }
    }

    .subtitle {
      color: #94a3b8;
      margin: 0.5rem 0 0 0;
      font-size: 1rem;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
      padding: 0.875rem 1.75rem;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(6, 182, 212, 0.5);
    }

    .btn-primary .icon {
      font-size: 1.25rem;
      font-weight: bold;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      border-color: rgba(6, 182, 212, 0.3);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon svg {
      width: 30px;
      height: 30px;
    }

    .stat-icon.blue {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
    }

    .stat-icon.green {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    .stat-icon.purple {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      color: white;
    }

    .stat-icon.orange {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: white;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      color: white;
    }

    .stat-label {
      color: #94a3b8;
      font-size: 0.875rem;
    }

    /* Filters */
    .filters-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .search-box {
      position: relative;
      flex: 1;
      max-width: 500px;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: #64748b;
    }

    .search-input {
      width: 100%;
      padding: 0.875rem 2.5rem 0.875rem 3rem;
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      background: rgba(30, 41, 59, 0.8);
      color: white;
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #06b6d4;
      box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.1);
    }

    .search-input::placeholder {
      color: #64748b;
    }

    .clear-search {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      font-size: 1rem;
    }

    .filter-select {
      padding: 0.875rem 1.5rem;
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      background: rgba(30, 41, 59, 0.8);
      color: white;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .filter-select:focus {
      outline: none;
      border-color: #06b6d4;
    }

    /* Table */
    .products-table-wrapper {
      background: rgba(30, 41, 59, 0.6);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }

    .products-table {
      width: 100%;
      border-collapse: collapse;
    }

    .products-table thead {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    }

    .products-table th {
      padding: 1rem;
      text-align: left;
      color: #94a3b8;
      font-weight: 600;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .products-table tbody tr {
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;
      animation: fadeInRow 0.5s ease forwards;
      opacity: 0;
    }

    @keyframes fadeInRow {
      to { opacity: 1; }
    }

    .products-table tbody tr:hover {
      background: rgba(6, 182, 212, 0.05);
    }

    .products-table td {
      padding: 1rem;
      vertical-align: middle;
    }

    .product-logo {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      object-fit: cover;
      border: 2px solid rgba(6, 182, 212, 0.3);
    }

    .product-name {
      display: block;
      color: white;
      font-weight: 600;
      font-size: 1rem;
    }

    .product-id {
      display: block;
      color: #64748b;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .product-desc {
      color: #cbd5e1;
      font-size: 0.9rem;
      max-width: 250px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .date-badge {
      display: inline-block;
      padding: 0.375rem 0.75rem;
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .date-badge.warning {
      background: rgba(245, 158, 11, 0.2);
      color: #f59e0b;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-action {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .btn-action svg {
      width: 18px;
      height: 18px;
    }

    .btn-action.edit {
      background: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
      border: none;
      cursor: pointer;
    }

    .btn-action.edit:hover {
      background: #3b82f6;
      color: white;
      transform: scale(1.1);
    }

    .btn-action.delete {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
      border: none;
      cursor: pointer;
    }

    .btn-action.delete:hover {
      background: #ef4444;
      color: white;
      transform: scale(1.1);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: white;
      margin: 0 0 0.5rem 0;
    }

    .empty-state p {
      color: #64748b;
      margin: 0 0 1.5rem 0;
    }

    /* Skeleton Loading */
    .loading-skeleton {
      padding: 2rem;
    }

    .skeleton-row {
      display: flex;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .skeleton {
      height: 40px;
      background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 8px;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .pagination-info {
      color: #94a3b8;
      font-size: 0.9rem;
    }

    .pagination-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-pagination {
      padding: 0.5rem 1rem;
      background: rgba(30, 41, 59, 0.8);
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-pagination:hover:not(:disabled) {
      background: #06b6d4;
      border-color: #06b6d4;
      color: white;
    }

    .btn-pagination.active {
      background: #06b6d4;
      border-color: #06b6d4;
      color: white;
    }

    .btn-pagination:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border-radius: 20px;
      padding: 2.5rem;
      width: 90%;
      max-width: 450px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
      animation: scaleIn 0.3s ease;
    }

    @keyframes scaleIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .modal-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .modal-icon svg {
      width: 40px;
      height: 40px;
    }

    .modal-icon.delete {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
    }

    .modal h3 {
      color: white;
      font-size: 1.5rem;
      margin: 0 0 1rem 0;
    }

    .modal p {
      color: #94a3b8;
      margin: 0 0 0.5rem 0;
    }

    .modal strong {
      color: #06b6d4;
    }

    .modal-warning {
      color: #ef4444 !important;
      font-size: 0.875rem;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1.5rem;
    }

    .btn-secondary {
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .btn-danger {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
    }

    .btn-danger:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.5);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .th-desc, .td-desc {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .title {
        font-size: 1.75rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .th-date, .td-date {
        display: none;
      }

      .dashboard-header {
        flex-direction: column;
        align-items: stretch;
      }

      .btn-primary {
        justify-content: center;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  loading = signal(true);
  
  searchText = '';
  itemsPerPage = 10;
  currentPage = 1;
  
  productoAEliminar: Product | null = null;
  
  currentYear = new Date().getFullYear();
  currentTime = '';
  
  private intervalId: any;

  constructor(
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
  }

  updateTime(): void {
    this.currentTime = new Date().toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.filterProducts();
        this.loading.set(false);
      },
      error: () => {
        this.toastService.error('Error al cargar productos. Verifica que el backend esté corriendo.');
        this.loading.set(false);
      }
    });
  }

  filterProducts(): void {
    const search = this.searchText.toLowerCase();
    const filtered = this.products().filter(p => 
      p.name.toLowerCase().includes(search) ||
      p.id.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
    );
    this.filteredProducts.set(filtered);
    this.currentPage = 1;
  }

  clearSearch(): void {
    this.searchText = '';
    this.filterProducts();
  }

  activeProducts(): number {
    return this.products().length;
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage, this.filteredProducts().length);
  }

  totalPages(): number {
    return Math.ceil(this.filteredProducts().length / this.itemsPerPage);
  }

  paginatedProducts(): Product[] {
    return this.filteredProducts().slice(this.startIndex, this.endIndex);
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const total = this.totalPages();
    const current = this.currentPage;
    
    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);
    
    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(5, total);
      } else {
        start = Math.max(1, total - 4);
      }
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
  }

  editarProducto(product: Product): void {
    window.location.href = `/editar/${product.id}`;
  }

  mostrarModalEliminar(product: Product): void {
    this.productoAEliminar = product;
  }

  cancelarEliminar(): void {
    this.productoAEliminar = null;
  }

  confirmarEliminar(): void {
    if (!this.productoAEliminar) return;
    
    this.productService.deleteProduct(this.productoAEliminar.id).subscribe({
      next: () => {
        this.toastService.success(`Producto "${this.productoAEliminar!.name}" eliminado correctamente`);
        this.productoAEliminar = null;
        this.loadProducts();
      },
      error: () => {
        this.toastService.error('Error al eliminar el producto');
      }
    });
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjN2EzYzljIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6bTAtMTJjLTIuMjEgMC00LTIuNzUtNC02czIuNzktNCA2LTQgNCAyLjc1IDQgNi0yLjc5IDQtNiA0em0wIDhjLTEuMSAwLTItLjktMi0yczAuOS0yIDItMiAyIC45IDIgMi0uOSAyLTIgMnoiLz48L3N2Zz4=';
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';



@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
    products: Product[] = [];
    filteredProducts: Product[] = [];
    loading = false;
    errorMessage = '';
    searchText = '';
    cantidadMostrar = 5;

    openedMenu: string | null = null;
    productoAEliminar: Product | null = null;

    constructor(private productService: ProductService, private router: Router) { }

    ngOnInit(): void {
        this.cargarProductos();
    }
    cargarProductos() {
        this.loading = true;
        this.productService.getProducts().subscribe({
            next: res => {
                this.products = res.data;
                this.aplicarFiltro();
                this.loading = false;
            },
            error: err => {
                this.errorMessage = 'Error cargando productos: ' + err.message;
                this.loading = false;
            }
        });
    }
    aplicarFiltro() {
        const search = this.searchText.toLowerCase();
        const filtrados = this.products.filter(p =>
            p.name.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search)
        );
        this.filteredProducts = filtrados.slice(0, this.cantidadMostrar);
    }
    onSearchChange(): void {
        this.aplicarFiltro();
    }

    onChangeCantidad(): void {
        this.aplicarFiltro();
    }

    toggleMenu(productId: string) {
        this.openedMenu = this.openedMenu === productId ? null : productId;
    }

    editarProducto(product: Product) {
        this.openedMenu = null;
        this.router.navigate(['/editar', product.id]);
    }

    mostrarModalEliminar(product: Product) {
        this.openedMenu = null;
        this.productoAEliminar = product;
    }

    cancelarEliminar() {
        this.productoAEliminar = null;
    }

    confirmarEliminar() {
        if (this.productoAEliminar) {
            const id = this.productoAEliminar.id;

            this.productService.deleteProduct(id).subscribe({
                next: () => {
                    this.products = this.products.filter(p => p.id !== id);
                    this.aplicarFiltro();
                    this.productoAEliminar = null;
                },
                error: err => {
                    this.errorMessage = 'Error eliminando producto: ' + err.message;
                    this.productoAEliminar = null;
                }
            });
        }
    }

}
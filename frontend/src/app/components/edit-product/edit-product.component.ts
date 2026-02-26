import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  errorMessage = '';
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.crearFormulario();

    if (this.productId) {
      this.cargarProducto(this.productId);
    } else {
      this.errorMessage = 'ID de producto inválido.';
    }
  }

  crearFormulario() {
    this.form = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required],
    });
  }

  cargarProducto(id: string) {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (p) => {
        if (!p) {
          this.errorMessage = 'Producto no encontrado.';
          this.loading = false;
          return;
        }
        this.form.patchValue({
          id: p.id,
          name: p.name,
          description: p.description,
          logo: p.logo,
          date_release: p.date_release,
          date_revision: p.date_revision,
        });
        this.loading = false;
      },
      error: (err: any) => {
        if (err.status === 0) {
          this.errorMessage = 'No se puede conectar al servidor. Asegúrate de que el backend esté corriendo.';
        } else {
          this.errorMessage = 'Error cargando producto: ' + (err.error?.message || err.message);
        }
        this.loading = false;
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.productId) {
      this.errorMessage = 'ID de producto inválido.';
      return;
    }

    const updatedProduct: Product = {
      id: this.productId,
      name: this.f['name'].value,
      description: this.f['description'].value,
      logo: this.f['logo'].value,
      date_release: this.f['date_release'].value,
      date_revision: this.f['date_revision'].value,
    };

    this.loading = true;
    this.productService.updateProduct(updatedProduct).subscribe({
      next: () => {
        this.toastService.success('¡Producto actualizado exitosamente!');
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/productos']);
        }, 1500);
      },
      error: (err: any) => {
        if (err.status === 0) {
          this.toastService.error('No se puede conectar al servidor. Asegúrate de que el backend esté corriendo.');
        } else {
          this.toastService.error('Error actualizando producto: ' + (err.error?.message || err.message));
        }
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/productos']);
  }
}

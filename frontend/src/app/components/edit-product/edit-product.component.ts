import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

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
    private router: Router
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
      id: [{ value: '', disabled: true }, Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      logo: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
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
      error: (err) => {
        this.errorMessage = 'Error cargando producto: ' + err.message;
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
        this.loading = false;
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        this.errorMessage = 'Error actualizando producto: ' + err.message;
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/productos']);
  }
}

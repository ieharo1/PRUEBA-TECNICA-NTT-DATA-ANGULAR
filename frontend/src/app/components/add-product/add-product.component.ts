import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit {
  form!: FormGroup;
  idDisponible: boolean | null = null;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextYearStr = nextYear.toISOString().split('T')[0];

    this.form = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: [today, Validators.required],
      date_revision: [nextYearStr, Validators.required]
    });
  }

  verificarId(): void {
    const id = this.form.value.id;
    if (!id || id.length < 3) {
      this.idDisponible = null;
      return;
    }

    this.http.get<boolean>(`http://localhost:3002/bp/products/verification/${id}`).subscribe({
      next: (existe) => this.idDisponible = !existe,
      error: () => {
        this.idDisponible = null;
        this.toastService.error('Error al verificar ID. Asegúrate de que el backend esté corriendo.');
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.idDisponible === false) return;

    const data = this.form.value;
    
    this.http.post('http://localhost:3002/bp/products', data).subscribe({
      next: () => {
        this.toastService.success('¡Producto creado exitosamente!');
        setTimeout(() => {
          this.router.navigate(['/productos']);
        }, 1500);
      },
      error: (err) => {
        if (err.status === 0) {
          this.toastService.error('No se puede conectar al servidor. Asegúrate de que el backend esté corriendo en localhost:3002');
        } else {
          this.toastService.error('Error al crear el producto: ' + (err.error?.message || err.message));
        }
      }
    });
  }

  onReset(): void {
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextYearStr = nextYear.toISOString().split('T')[0];
    
    this.form.reset({
      date_release: today,
      date_revision: nextYearStr
    });
    this.idDisponible = null;
  }
}

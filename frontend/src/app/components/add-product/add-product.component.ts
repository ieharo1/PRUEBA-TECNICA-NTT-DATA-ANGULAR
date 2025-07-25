import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required]
    });
  }

  verificarId(): void {
    const id = this.form.value.id;
    if (!id || id.length < 3) return;

    this.http.get<boolean>(`http://localhost:3002/bp/products/verification/${id}`).subscribe({
      next: (existe) => this.idDisponible = !existe,
      error: () => this.idDisponible = null
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.idDisponible === false) return;

    const data = this.form.value;
    console.log('Enviando producto:', data);  // <--- aquí
    this.http.post('http://localhost:3002/bp/products', data).subscribe({
      next: () => {
        this.successMessage = '✅ Producto agregado correctamente';
        this.errorMessage = '';
        this.form.reset();  
        this.idDisponible = null;
      },
      error: (err) => {
        this.errorMessage = '❌ Error al guardar: ' + err.message;
        this.successMessage = '';
      }
    });
  }

  onReset(): void {
    this.form.reset();
    this.idDisponible = null;
    this.successMessage = '';
    this.errorMessage = '';
  }
}

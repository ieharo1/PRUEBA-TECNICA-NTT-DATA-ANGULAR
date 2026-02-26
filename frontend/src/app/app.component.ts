import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
      
      <!-- Toast Container -->
      <div class="toast-container">
        @for (toast of toastService.toastsList(); track toast.id) {
          <div class="toast" [class]="toast.type" (click)="toastService.remove(toast.id)">
            <span class="toast-icon">
              @switch (toast.type) {
                @case ('success') { ✓ }
                @case ('error') { ✕ }
                @case ('warning') { ⚠ }
                @case ('info') { ℹ }
              }
            </span>
            <span class="toast-message">{{ toast.message }}</span>
          </div>
        }
      </div>

      <footer class="app-footer">
        <div class="footer-content">
          <p class="footer-title">👨‍💻 Desarrollado por Isaac Esteban Haro Torres</p>
          <p class="footer-subtitle">Ingeniero en Sistemas · Full Stack · Automatización · Data</p>
          <div class="footer-links">
            <a href="mailto:zackharo1&#64;gmail.com" class="footer-link">📧 Email</a>
            <a href="https://wa.me/59398805517" class="footer-link">📱 WhatsApp</a>
            <a href="https://github.com/ieharo1" target="_blank" class="footer-link">💻 GitHub</a>
            <a href="https://ieharo1.github.io/portafolio-isaac.haro/" target="_blank" class="footer-link">🌐 Portafolio</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-radius: 12px;
      color: white;
      font-weight: 500;
      cursor: pointer;
      animation: slideIn 0.3s ease, fadeOut 0.3s ease;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }

    .toast.success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-left: 4px solid #34d399;
    }

    .toast.error {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      border-left: 4px solid #f87171;
    }

    .toast.warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      border-left: 4px solid #fbbf24;
    }

    .toast.info {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      border-left: 4px solid #60a5fa;
    }

    .toast-icon {
      font-size: 18px;
      font-weight: bold;
    }

    .toast-message {
      flex: 1;
      font-size: 14px;
    }

    .app-footer {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #fff;
      padding: 2.5rem 1rem;
      margin-top: auto;
      text-align: center;
      border-top: 3px solid #06b6d4;
    }

    .footer-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .footer-title {
      font-size: 1.4rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      background: linear-gradient(90deg, #06b6d4, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .footer-subtitle {
      font-size: 0.95rem;
      color: #94a3b8;
      margin: 0 0 1.5rem 0;
    }

    .footer-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
    }

    .footer-link {
      color: #e2e8f0;
      text-decoration: none;
      font-size: 0.9rem;
      padding: 0.6rem 1.2rem;
      background: rgba(255,255,255,0.08);
      border-radius: 25px;
      transition: all 0.3s ease;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .footer-link:hover {
      background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(6, 182, 212, 0.4);
    }

    @media (max-width: 600px) {
      .toast-container {
        left: 20px;
        right: 20px;
        max-width: none;
      }
      
      .footer-links {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class AppComponent {
  constructor(public toastService: ToastService) {}
}

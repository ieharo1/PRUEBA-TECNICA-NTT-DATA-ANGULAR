import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
      <footer class="app-footer">
        <div class="footer-content">
          <p class="footer-title">👨‍💻 Desarrollado por Isaac Esteban Haro Torres</p>
          <p class="footer-subtitle">Ingeniero en Sistemas · Full Stack · Automatización · Data</p>
          <div class="footer-links">
            <a href="mailto:zackharo1&#64;gmail.com" class="footer-link">📧 Email: zackharo1&#64;gmail.com</a>
            <a href="https://wa.me/59398805517" class="footer-link">📱 WhatsApp: 098805517</a>
            <a href="https://github.com/ieharo1" target="_blank" class="footer-link">💻 GitHub: https://github.com/ieharo1</a>
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
    .app-footer {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #fff;
      padding: 2rem 1rem;
      margin-top: auto;
      text-align: center;
      border-top: 3px solid #00d9ff;
    }
    .footer-content {
      max-width: 800px;
      margin: 0 auto;
    }
    .footer-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: #00d9ff;
    }
    .footer-subtitle {
      font-size: 0.9rem;
      color: #a0a0a0;
      margin: 0 0 1rem 0;
    }
    .footer-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
    }
    .footer-link {
      color: #fff;
      text-decoration: none;
      font-size: 0.85rem;
      padding: 0.5rem 1rem;
      background: rgba(255,255,255,0.1);
      border-radius: 20px;
      transition: all 0.3s ease;
    }
    .footer-link:hover {
      background: #00d9ff;
      color: #1a1a2e;
      transform: translateY(-2px);
    }
  `]
})
export class AppComponent {}

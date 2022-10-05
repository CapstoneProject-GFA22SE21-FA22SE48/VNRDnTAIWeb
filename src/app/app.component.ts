import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private primeNGConfig: PrimeNGConfig
  ) {}
  ngOnInit(): void {
    var vn = require('../assets/i18n/vn.json');
    this.primeNGConfig.setTranslation(vn);
  }
  title = 'VNRDnTAIWeb';
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false,   // <-- TAMBAHKAN BARIS INI
})
export class WelcomePage {

  constructor(private router: Router) {}

  masukUser() {
    this.router.navigate(['/home']);
  }

  masukAdmin() {
    this.router.navigate(['/admin/dashboard']);
  }

}
import { Component, OnInit } from '@angular/core';
import { TempatserviceService } from '../tempatservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  tempats: any[] = [];

  constructor(
    private tempatService: TempatserviceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.tempats = this.tempatService.getTempat();
    console.log(this.tempats);
  }

  goToDetail(tempat: any) {
    const nama = tempat.nama.toLowerCase();

    if (nama.includes('mina')) {
      this.router.navigate(['/detail-mina'], { state: { data: tempat } });
    } else if (nama.includes('akhir')) {
      this.router.navigate(['/detail-makkah-akhir'], { state: { data: tempat } });
    } else {
      this.router.navigate(['/detail'], { state: { data: tempat } });
    }
  }
}

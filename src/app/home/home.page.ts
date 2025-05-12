import { Component, OnInit } from '@angular/core';
import { TempatserviceService } from '../tempatservice.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  tempats: any[] = [];

  constructor(private tempatService: TempatserviceService) {}

  ngOnInit() {
    // Memanggil fungsi getTempat dari service
    this.tempats = this.tempatService.getTempat();
    console.log(this.tempats);
  }

}

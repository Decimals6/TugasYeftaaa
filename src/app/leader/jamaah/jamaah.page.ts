import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaderService, JamaahDetailResponse } from '../../services/leader';

@Component({
  selector: 'app-jamaah',
  templateUrl: './jamaah.page.html',
  styleUrls: ['./jamaah.page.scss'],
  standalone: false
})
export class JamaahPage implements OnInit {
  userId!: number;
  data: JamaahDetailResponse | null = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leaderService: LeaderService
  ) {}

  ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDetail();
  }

  loadDetail() {
    this.loading = true;
    this.leaderService.getJamaahDetail(this.userId).subscribe(
      res => {
        if (res.status === 'success') {
          this.data = res.data;
        }
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  openOnMap() {
    if (this.userId) {
      this.router.navigate(['/leader/maps', this.userId]);
    }
  }
}
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  // =========================
  // HALAMAN AWAL
  // =========================
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },

  // =========================
  // WELCOME
  // =========================
  {
    path: 'welcome',
    loadChildren: () =>
      import('./welcome/welcome.module').then(
        (m) => m.WelcomePageModule
      )
  },

  // =========================
  // USER
  // =========================
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then(
        (m) => m.HomePageModule
      )
  },
  {
    path: 'detail/:index',
    loadChildren: () =>
      import('./detail/detail.module').then(
        (m) => m.DetailPageModule
      )
  },
  {
    path: 'mina',
    loadChildren: () =>
      import('./mina/mina.module').then(
        (m) => m.MinaPageModule
      )
  },
  {
    path: 'minadetail/:index',
    loadChildren: () =>
      import('./minadetail/minadetail.module').then(
        (m) => m.MinadetailPageModule
      )
  },
  {
    path: 'makkahakhir/:index',
    loadChildren: () =>
      import('./makkahakhir/makkahakhir.module').then(
        (m) => m.MakkahakhirPageModule
      )
  },
  {
    path: 'makkahakhirdetail/:index1/:index2',
    loadChildren: () =>
      import('./makkahakhirdetail/makkahakhirdetail.module').then(
        (m) => m.MakkahakhirdetailPageModule
      )
  },

  // =========================
  // TEST
  // =========================
  {
    path: 'teskoor',
    loadChildren: () =>
      import('./teskoor/teskoor.module').then(
        (m) => m.TeskoorPageModule
      )
  },
  {
    path: 'tesrute',
    loadChildren: () =>
      import('./tesrute/tesrute.module').then(
        (m) => m.TesrutePageModule
      )
  },
  {
     path: 'admin/dashboard',
  loadChildren: () =>
    import('./admin/dashboard/dashboard.module').then(
      m => m.DashboardPageModule
    )
  },
  {
    path: 'admin/jamaah',
  loadChildren: () =>
    import('./admin/jamaah/jamaah.module').then(
      m => m.JamaahPageModule
    )
  },
  {
      path: 'admin/detail-jamaah/:id',
  loadChildren: () =>
    import('./admin/detail-jamaah/detail-jamaah.module').then(
      m => m.DetailJamaahPageModule
    )
  },
  {
    path: 'admin/group-haji',
  loadChildren: () =>
    import('./admin/group-haji/group-haji.module').then(
      m => m.GroupHajiPageModule
    )
  },
  {
     path: 'admin/monitoring',
  loadChildren: () =>
    import('./admin/monitoring/monitoring.module').then(
      m => m.MonitoringPageModule
    )
  },
  {
     path: 'admin/notifikasi',
  loadChildren: () =>
    import('./admin/notifikasi/notifikasi.module').then(
      m => m.NotifikasiPageModule
    )
  },
{
  path: 'admin/laporan',
  loadChildren: () =>
    import('./admin/laporan/laporan.module').then(
      m => m.LaporanPageModule
    )
},






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
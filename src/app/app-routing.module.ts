import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

const routes: Routes = [
  // =========================
  // HALAMAN AWAL (Arahkan langsung ke login atau welcome)
  // =========================
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // =========================
  // WELCOME & LOGIN (Bebas tanpa guard)
  // =========================
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },

  // =========================
  // USER (JAMAAH)
  // =========================
  {
    path: 'home',
    canActivate: [authGuard],
    data: { roles: ['jamaah'] },
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'detail/:index',
    canActivate: [authGuard],
    data: { roles: ['jamaah'] },
    loadChildren: () => import('./detail/detail.module').then(m => m.DetailPageModule)
  },
  {
    path: 'mina',
    canActivate: [authGuard],
    data: { roles: ['jamaah'] },
    loadChildren: () => import('./mina/mina.module').then(m => m.MinaPageModule)
  },
  {
    path: 'minadetail/:index',
    canActivate: [authGuard],
    data: { roles: ['jamaah'] },
    loadChildren: () => import('./minadetail/minadetail.module').then(m => m.MinadetailPageModule)
  },
  {
    path: 'makkahakhir/:index',
    canActivate: [authGuard],
    data: { roles: ['jamaah'] },
    loadChildren: () => import('./makkahakhir/makkahakhir.module').then(m => m.MakkahakhirPageModule)
  },
  {
    path: 'makkahakhirdetail/:index1/:index2',
    canActivate: [authGuard],
    data: { roles: ['jamaah'] },
    loadChildren: () => import('./makkahakhirdetail/makkahakhirdetail.module').then(m => m.MakkahakhirdetailPageModule)
  },

  // =========================
  // TEST
  // =========================
  {
    path: 'teskoor',
    canActivate: [authGuard],
    data: { roles: ['jamaah'] },
    loadChildren: () => import('./teskoor/teskoor.module').then(m => m.TeskoorPageModule)
  },
  {
    path: 'tesrute',
    canActivate: [authGuard],
    data: { roles: ['jamaah'] },
    loadChildren: () => import('./tesrute/tesrute.module').then(m => m.TesrutePageModule)
  },

  // =========================
  // ADMIN (ROLE HARUS ADMIN)
  // =========================
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { roles: ['admin'] }, // Ubah dari 'jamaah' ke 'admin'
    children: [
      {
        path: '',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminPageModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./admin/users/users.module').then(m => m.UsersPageModule)
      },
      {
        path: 'groups',
        loadChildren: () => import('./admin/groups/groups.module').then(m => m.GroupsPageModule)
      },
      {
        path: 'ausers/create',
        loadChildren: () => import('./admin/users/create/create.module').then(m => m.CreatePageModule)
      },
      {
        path: 'groups/edit/:id',
        loadChildren: () => import('./admin/groups/edit/edit.module').then(m => m.EditPageModule)
      },
      {
        path: 'groups/detail/:id',
        loadChildren: () => import('./admin/groups/detail/detail.module').then(m => m.DetailPageModule)
      },
    ]
  },
  {
    path: 'leader',
    canActivate: [authGuard],
    data: { roles: ['leader'] },
    children: [
      {
        path: '',
        loadChildren: () => import('./leader/leader.module').then(m => m.LeaderPageModule)
      },
      {
        path: 'maps',
        loadChildren: () => import('./leader/maps/maps.module').then(m => m.MapsPageModule)
      },
      {
        path: 'maps/:id',
        loadChildren: () => import('./leader/maps/maps.module').then(m => m.MapsPageModule)
      },
      {
        path: 'jamaah/:id',
        loadChildren: () => import('./leader/jamaah/jamaah.module').then(m => m.JamaahPageModule)
      }
    ]
  },
  {
    path: 'leader',
    loadChildren: () => import('./leader/leader.module').then(m => m.LeaderPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
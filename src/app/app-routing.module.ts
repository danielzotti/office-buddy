import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BadgeListComponent } from './pages/badge-list/badge-list.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { IsAdminGuard } from './modules/core/guards/is-admin-guard.service';
import { LoginComponent } from './pages/login/login.component';
import { IsAuthorizedGuard } from './modules/core/guards/is-authorized-guard.service';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [IsAuthorizedGuard]
  },
  {
    path: 'badges',
    component: BadgeListComponent,
    canActivate: [IsAuthorizedGuard]
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [IsAuthorizedGuard, IsAdminGuard]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
})
export class AppRoutingModule {
}

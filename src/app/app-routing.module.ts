import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { BadgeListPageComponent } from './pages/badge-list/badge-list-page.component';
import { NotFoundPageComponent } from './pages/not-found/not-found-page.component';
import { UserListPageComponent } from './pages/user-list/user-list-page.component';
import { IsAdminGuard } from './modules/core/guards/is-admin-guard.service';
import { LoginPageComponent } from './pages/login/login-page.component';
import { IsAuthorizedGuard } from './modules/core/guards/is-authorized-guard.service';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'home',
    component: HomePageComponent,
    canActivate: [IsAuthorizedGuard]
  },
  {
    path: 'badges',
    component: BadgeListPageComponent,
    canActivate: [IsAuthorizedGuard]
  },
  {
    path: 'users',
    component: UserListPageComponent,
    canActivate: [IsAuthorizedGuard, IsAdminGuard]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundPageComponent
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

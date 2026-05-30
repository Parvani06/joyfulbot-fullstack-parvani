import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ManagerGuard } from './guards/manager.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadChildren: './modules/auth/auth.module#AuthModule' },
  { path: 'dashboard', loadChildren: './modules/dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard] },
  { path: 'leaves', loadChildren: './modules/leave/leave.module#LeaveModule', canActivate: [AuthGuard] },
  { path: 'manager', loadChildren: './modules/manager/manager.module#ManagerModule', canActivate: [AuthGuard, ManagerGuard] },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
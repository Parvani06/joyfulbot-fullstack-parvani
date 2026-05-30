import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { TeamLeavesComponent } from './team-leaves/team-leaves.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: ManagerDashboardComponent },
  { path: 'team-leaves', component: TeamLeavesComponent }
];

@NgModule({
  declarations: [
    ManagerDashboardComponent,
    TeamLeavesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class ManagerModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LeaveListComponent } from './leave-list/leave-list.component';
import { LeaveApplyComponent } from './leave-apply/leave-apply.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: LeaveListComponent },
  { path: 'apply', component: LeaveApplyComponent }
];

@NgModule({
  declarations: [
    LeaveListComponent,
    LeaveApplyComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class LeaveModule {}
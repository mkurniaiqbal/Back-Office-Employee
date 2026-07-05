import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

declare const bootstrap: any;
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  sidebarMenus = [
    {
      label: 'Employees',
      link: '/employees',
      icon: 'bi bi-people',
    },
  ];
  closeMobileSidebar() {
    const element = document.getElementById('mobileSidebar');

    if (!element) return;

    const instance =
      bootstrap.Offcanvas.getInstance(element) ??
      new bootstrap.Offcanvas(element);

    instance.hide();
  }
}

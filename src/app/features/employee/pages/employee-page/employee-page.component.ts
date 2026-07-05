import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-employee-page',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './employee-page.component.html'
})
export class EmployeePageComponent {
  title = '';
}

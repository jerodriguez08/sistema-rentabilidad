import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registered',
  templateUrl: './registered.component.html',
  styleUrls: ['./registered.component.css']
})
export class RegisteredComponent implements OnInit {

  // @Output() template: boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    
  }

  goToLogin() {
    localStorage.removeItem('email');
    this.router.navigateByUrl('/auth');
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router
    ) { }

  ngOnInit() {
  }

  login(email: string, password: string) {
    this.authService.login(email, password)
    .then(() => {
      this.router.navigate(['/']);
    })
    .catch(error => {
      this.errorHandler.handle(error);
    });
  }

}

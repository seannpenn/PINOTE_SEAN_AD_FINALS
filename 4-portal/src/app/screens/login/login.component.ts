import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/api.service';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  error: any;
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {}

  fCEmail = new FormControl();
  fCPassword = new FormControl();
  requestResult = '';
  userCredentials: string = 'null';

  async login() {
    var result: any = await this.auth
      .login(
        this.fCEmail.value,
        this.fCPassword.value,
      );
    this.requestResult = result.data;
    console.log(result);

    if (this.auth.authenticated) {
      this.nav('home');
    }else {
      this.error = result.data;
    }
    
  }

  nav(destination: string) {
    this.router.navigate([destination]);
  }
}

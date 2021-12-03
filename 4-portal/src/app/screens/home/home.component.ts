import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  
  constructor(private router: Router, private api: HttpClient) {}
  userList:any;

  idGetter: FormGroup = new FormGroup({
    fcId: new FormControl('', Validators.required)
  });

  enable = false;
  enable_1 = false;
  enable_2 = false;
  enable_3 = false;

  ngOnInit(): void { 
      this.api.get(environment.API_URL + '/user/all')
      .subscribe(data => {this.userList = data});
    
  }
  
}

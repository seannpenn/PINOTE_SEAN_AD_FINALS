import { Component, Input, OnInit } from '@angular/core';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/model/user.model';
import { ApiService } from 'src/app/shared/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: Array<User> = [];
  
  //icons
  faTrash = faTrash;
  faEdit = faEdit;
  
  clickedName = false;
  clickedAge = false;
  clickedEmail = false;
  clickedPassword = false;
  userId: string = '';
  userKeyIter = 0;
  passKeyName: string | undefined;
  passKeyAge: number | undefined;
  passKeyEmail: string | undefined;

  constructor(private api: ApiService) {}

  error = '';
  
  fcSearch:any;

  patchForm: FormGroup = new FormGroup({
    
    fcName: new FormControl('', Validators.required),
    fcAge: new FormControl(0),
    fcEmail: new FormControl('', Validators.required),
  });
  
  userKeys:Array<any> =[
    {name: "Name", value: false},
    {name: "Age", value: false},
    {name: "Email", value: false},
  ]

  ngOnInit(): void {
    this.getData();
  }

  clicked(i:number){
    
    if(i == 0){this.userKeys[i].value = !this.userKeys[i].value;}
    else if(i == 1){this.userKeys[i].value = !this.userKeys[i].value;}
    else if(i == 2){this.userKeys[i].value = !this.userKeys[i].value;}
    this.userKeyIter = i;
  }
  
  active = false;

  async exit(){
    this.active = false;
    this.patchForm.reset();
    this.userKeyIter = 0;
    this.userKeys[0].value = false;
    this.userKeys[1].value = false;
    this.userKeys[2].value = false;
  }
  async pop(passId:string){
    this.userId = passId;
    this.active = true;
  }
  async getValuePatch(passId:string){
    passId = this.userId;
    this.users.forEach(user=>{
      if(user.id == passId){
        if(this.userKeys[0].value == true)
          this.passKeyName = user.name;
        if(this.userKeys[1].value == true)
          this.passKeyAge = user.age;
        if(this.userKeys[2].value == true)
        this.passKeyEmail = user.email;
      }
    });

  }
  async patchUser(passId:string){
    this.active = true;

    var returnName: Array<string> = [];
    
    this.users.forEach(user=>{
      if(user.id == passId){
        returnName.push(user.name);
      }
    });
    
    var decision = confirm('Confirm patch request for user ' + returnName + '?');
    if(decision){
        var result = await this.api.patch(`/user/${passId}`,{
          name: this.patchForm.value["fcName"] || undefined,
          age: parseInt(this.patchForm.value["fcAge"]) || undefined,
          email: this.patchForm.value["fcEmail"]|| undefined,
          
        }); 
    }
    if(result.success){
      this.resetDB();
      this.exit();
    }else{
      this.error = result.data;
    }
  }


  async deleteUser(i: string) {
    var returnName: Array<string> = [];
    this.users.forEach(user=>{
      if(user.id == i) returnName.push(user.name);
    });

    var decision = confirm('Delete user ' + returnName +'?')
    if(decision)
    {
      var result = await this.api.delete(`/user/${i}`);
      if(result.success){
        this.getData();
      }
    }
    return i;
  }

  async getUserInfo(i:number){
    var result = await this.api.get(`/user/${this.users[i].id}`);
    console.log(result.data);
  }
  
  


  async resetDB(){
    var result = await this.api.patch('/user/reset');
    this.getData();
  }
  async getData(term?: string) {
    if (term == undefined || term == null) {
      this.users = await this.getAll();
      console.log(this.users);
    }
  }
  async getAll(): Promise<Array<User>> {
    var result = await this.api.get('/user/all');
    var temp: Array<User> = [];
    if (result.success) {
      result.data.forEach((json: any) => {
        var tempU = User.fromJson(json.id, json);
        if (tempU != null) temp.push(tempU);
      });
    }
    return temp;
  }

  
}
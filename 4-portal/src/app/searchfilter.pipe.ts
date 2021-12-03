import { Pipe, PipeTransform } from '@angular/core';
import { User } from './model/user.model';

@Pipe({
  name: 'searchfilter'
})
export class SearchfilterPipe implements PipeTransform {
;
  transform(users: User[], fcSearch:string): User[] {
    if(!users || !fcSearch){
      return users;
    }
    return users.filter(user => 
      
      user.name.toLocaleLowerCase().includes(fcSearch.toLocaleLowerCase()) ||
      user.email.toLocaleLowerCase().includes(fcSearch.toLocaleLowerCase()) ||
      user.age.toString().includes(fcSearch.toLocaleLowerCase())

    
      ); 
    
  }

}

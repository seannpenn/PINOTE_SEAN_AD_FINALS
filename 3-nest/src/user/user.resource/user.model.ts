import { count } from 'console';
import { CRUDReturn } from './crud_return.interface';
import { Helper } from './helper';
import * as admin from 'firebase-admin';

export class User {
  public id: string;
  private name: string;
  private age: number;
  private email: string;
  private password: string;

  constructor(
    name: string,
    email: string,
    age: number,
    password: string,
    id?: string
  ) {
    if(id!=undefined){
      this.id = id;
    }
    else this.id = Helper.generateUID();
    this.name = name;
    this.email = email;
    this.age = age;
    this.password = password;
  }

  static async retrieve(id: string): Promise<User> {
    try {
      var DB = admin.firestore();
      var result = await DB.collection("users").doc(id).get();
      if (result.exists) {
        var data = result.data();
        return new User(data['id'], data['name'], data['age'], data['email']);
      }
    } catch (error) {
      return null;
    }
  }

  async commit():Promise <CRUDReturn>{
    try{
      var DB = admin.firestore();
      var result = await DB.collection("users").doc(this.id).set(this.toJson());
      console.log(result);
      return{
        success:true, data: this.toJson()
      };
    }catch(error){
      console.log(error);
      return{success:false, data:error};
    }
  }
  
  async login(password: string): Promise<CRUDReturn> {
    var DB = admin.firestore();
    var userPass = await DB.collection("users").where("password","==", password).get();
    

      if (!userPass.empty) {
        console.log('hi!!!');
        return { success: true, data: this.toJson()};
      } else {
        return { success: false,data: 'login fail, password does not match'};
      }
    
  }

  async matches(term: string): Promise <boolean> {
    var DB = admin.firestore();

    var keys: Array<string> = Helper.describeClass(User);
    keys = Helper.removeItemOnce(keys, 'password');

    console.log(keys);
    for (const key of keys) {
      if (`${this[key]}` === term) return true;
    }
    return false;
  }

  async replaceValues(body: any): Promise <boolean> {
    
    var DB = admin.firestore();
    await DB.collection("users").doc().update(body);

    return true;
      
    // if (this.id != body.id) {
    //   this.name = body?.name;
    //   this.age = body?.age;
    //   this.email = body?.email;
    //   this.password = body?.password;
    //   return true;
    // } else {
    //   return false;
    // }
  }

  replaceOneValue(body: any): boolean {
    return true;
  }

  // modifyUser(user:any){
  //     this.id =
  // }

  log() {
    console.log(this.toJson());
  }
  toJsonID() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      email: this.email,
    };
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      email: this.email,
      password: this.password
    };
  }
  returnNoID() {
    return {
      name: this.name,
      email: this.email,
      age: this.age,
    };
  }
  toJsonPass() {
    return {
      name: this.name,
      email: this.email,
      age: this.age,
      password: this.password,
    };
  }
  overWriteID(prevID: string) {
    this.id = prevID;
  }
}

import { Helper } from "./helper";

export class User {
  public id: string;
  public name: string;
  public age: number;
  public email: string;

  constructor(name: string, age: number, email: string, id: string) {
    if(id!=undefined){
      this.id = id;
    }
    else this.id = Helper.generateUID();
    this.name = name;
    this.age = age;
    this.email = email;
  }
  
  // static async retrieve(id: string): Promise<User> {
  //   try {
  //     var DB = admin.firestore();
  //     var result = await DB.collection("users").doc(id).get();
  //     if (result.exists) {
  //       var data = result.data();
  //       return new User(data['id'], data['name'], data['age'], data['email']);
  //     }
  //   } catch (error) {
  //     return null;
  //   }
  // }

  static fromJson(id: string, json: any): User | null {
    try {
      return new User(json.name, json.age, json.email, id);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  log() {
    console.log(this.toJson());
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      email: this.email,
    };
  }
  
}
import { CacheTTL, ConsoleLogger, Injectable, Param } from '@nestjs/common';
import { Helper } from './user.resource/helper';
import { User } from './user.resource/user.model';
// import { User } from './user.model';
import { CRUDReturn } from './user.resource/crud_return.interface';
import { debug } from 'console';
import * as admin from 'firebase-admin';


@Injectable()
export class UserService {
  // private users: Map<string, User> = new Map<string, User>();
  private DB = admin.firestore();
  
  constructor() {

    // this.users = Helper.populate();
  }

  async register(user: any): Promise <CRUDReturn> {
    try {
      var validBodyPut: { valid: boolean; data: string } =
        Helper.validBodyPut(user);

      if (validBodyPut.valid) {
        var exists = await this.emailExists(user.email);
        console.log(exists);
        if (!exists) {
          console.log(!exists);
          var newUser: User;
          newUser = new User(
            user.name,
            user.email,
            user.age,
            user.password,
          );

          if (await this.pushToDB(newUser)) {
            if (debug) this.getAll();
            console.log(newUser.toJson());
            return {
              success: true,
              data: newUser.toJson(),
            };
          } else {
            throw new Error('generic database error.');
          }
        } else {
          throw new Error(
            `${user.email} is already used by another user. Please input another email!`,
          );
        }
      } else {
        throw new Error(validBodyPut.data);
      }
    } catch (error) {
      return { success: false, data: `${error.message}` };
    }

    //dont touch this//
    // var newUser: User;
    // newUser = new User(user.name,user.age,user.email,user.password);
    // this.users.set(user.id,newUser);
  }
  async getAll(): Promise<CRUDReturn> {
    var results: Array<any> = [];
    try {
      var allUsers = await this.getAllUserObjects();
      allUsers.forEach((users) => {
          results.push(users.toJsonID());
      });
      
      if(results.length>0)
        return { success: true, data: results};
      else
        return { success: false, data: 'Empty database'};
    } catch (error) {
      return {success: false, data:error};
    }
  }

  async getAllUserObjects(): Promise<Array<User>>{
    var results: Array<User> = [];
   
    try {
      var dbData: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> =
        await this.DB.collection("users").get();
      
      dbData.forEach((doc) => {
        if (doc.exists){
          
          results.push(new User(
            
            doc.data()["name"],
            doc.data()["email"],
            doc.data()["age"],
            doc.data()["password"],
            doc.id
            
          ));
        }
      });
      console.log(results);
      return results;
    } catch (error) {
      return null;
    }
  }

  async getID(ConsID: string): Promise<CRUDReturn> {
    console.log(`I am getting ${ConsID}!`);
    if(ConsID == '\0' || ConsID == "null" || ConsID == ""){
      return {
        success: false,
        data: `User ${ConsID} does not exist in the database.`,
      };
    }
    try {
      
      var dbData = await this.DB.collection("users").get();
      var returnUser:Array<any> = [];

      dbData.forEach((doc)=>{
        console.log(doc.id);
        if(doc.id == ConsID){
          returnUser.push(doc.data())
        }
      })
      
        if(returnUser.length > 0){
          return {
          success: true,
          data: returnUser,
        };
        } else
        return {
          success: false,
          data: `User ${ConsID} does not exist in the database.`,
        };
    } catch (error) {
      return error.message;
    }

  }

  async putValues(ConsID: string, user: any): Promise<CRUDReturn> {
    try {
      
      var userData = await this.DB.collection("users").doc(ConsID).get();
      var validBodyPut: { valid: boolean; data: string } =Helper.validBodyPut(user);
      if (validBodyPut.valid) {
          if (this.validateID(ConsID)) {
            var exists = await this.emailExists(user.email);
            
            if (!exists || user.email == userData.data()["email"]) {
              await this.DB.collection("users").doc(ConsID).update({name:user.name,email:user.email,age:user.age,password:user.password});
                if(userData.exists){
                  return{
                    success: true,
                    data: userData.data(),
                  }
                }
              // }
            }else{
              return {
                success: false,
                data: `${user.email} exists in database that is not of the current user.`,
              };
            }
            
          } throw new Error('user does not exist');
      } else {
        throw new Error(validBodyPut.data);
      }
    } catch (error) {
      return { success: false, data: `${error.message}` };
    }
  }

  async patchValues(ConsID: string, user: any): Promise <CRUDReturn> {
    var count: number = this.countBody(user, count);
    var validBody: { valid: boolean; data: string } = Helper.validBody(user);
    var userData = await this.DB.collection("users").doc(ConsID).get();
    
    try {
      if (validBody.valid) {
        // for (const iter of this.users.values()) {
          
          if (this.validateID(ConsID)) {
            
            var exists = await this.emailExists(user?.email);
            
            if (!exists || user.email == userData.data()["email"]){
              
              if (count == 1) {
                
                if (user.name != undefined) {
                  
                  await this.DB.collection("users").doc(ConsID).update({name: user.name});
                  var getData = (await this.DB.collection("users").doc(ConsID).get()).data();
                  console.log(getData);
                }
                if (user.age != undefined) {
                  await this.DB.collection("users").doc(ConsID).update({age: user.age});
                  var getData = (await this.DB.collection("users").doc(ConsID).get()).data();
                  console.log(getData);
                  
                }
                if (user.email != undefined) {
                  await this.DB.collection("users").doc(ConsID).update({email: user.email});
                  var getData = (await this.DB.collection("users").doc(ConsID).get()).data();
                  console.log(getData);
                  
                }
                if (user.password != undefined) {
                  await this.DB.collection("users").doc(ConsID).update({password: user.password});
                  var getData = (await this.DB.collection("users").doc(ConsID).get()).data();
                  console.log(getData);
                  
                }

                return{
                  success:true,
                  data:getData
                } 
              } 
              else if (count == 2) {
                if (user.name != undefined && user.age != undefined) {
                  await this.DB.collection("users").doc(ConsID).update({name: user.name,age: user.age});
                  var getData = (await this.DB.collection("users").doc(ConsID).get()).data();
                  console.log(getData);
                }
                if (user.name != undefined && user.email != undefined) {
                   await this.DB.collection("users").doc(ConsID).update({name: user.name,email: user.email});
                  var getData = (await this.DB.collection("users").doc(ConsID).get()).data();
                   console.log(getData);
                }
                if (user.name != undefined && user.password) {
                  await this.DB.collection("users").doc(ConsID).update({name: user.name,password: user.password});
                  var getData = (await this.DB.collection("users").doc(ConsID).get()).data();
                  console.log(getData);
                }
                if (user.age != undefined && user.email != undefined) {
                  await this.DB.collection("users").doc(ConsID).update({age: user.age,email: user.email});
                   var getData = (await this.DB.collection("users").doc(ConsID).get()).data();
                  console.log(getData);
                }
                if (user.age != undefined && user.password != undefined) {
                  await this.DB.collection("users").doc(ConsID).update({age: user.age,password: user.password});
                  var getData = (await this.DB.collection("users").doc(ConsID).get()).data();
                  console.log(getData);
                }
                if (user.email != undefined && user.password != undefined) {
                  await this.DB.collection("users").doc(ConsID).update({email: user.email,password: user.password});
                  var getData = (await this.DB.collection("users").doc(ConsID).get()).data();
                  console.log(getData);
                  }

                return{
                  success:true,
                  data:getData
                } 
              }
               else if (count == 3){
                if (user.name != undefined &&user.age != undefined &&user.email != undefined){
                  await this.DB.collection("users").doc(ConsID).update({name: user.name,age: user.age,email:user.email});
                  var getData = (await this.DB.collection("users").doc(ConsID).get()).data();
                  console.log(getData);
                }

                if (user.name != undefined &&user.age != undefined &&user.password != undefined){
                  await this.DB.collection("users").doc(ConsID).update({name: user.name,age: user.age,password:user.password});
                  var getData = (await this.DB.collection("users").doc(ConsID).get()).data();
                  console.log(getData);
                }

                if (user.name != undefined &&user.email != undefined &&user.password != undefined){
                  await this.DB.collection("users").doc(ConsID).update({name: user.name,email: user.email,password:user.password});
                  var getData = (await this.DB.collection("users").doc(ConsID).get()).data();
                  console.log(getData);
                }
                if (user.age != undefined &&user.email != undefined &&user.password != undefined){
                  await this.DB.collection("users").doc(ConsID).update({age: user.age,email: user.email,password:user.password});
                  var getData = (await this.DB.collection("users").doc(ConsID).get()).data();
                  console.log(getData);
                }

                  return{
                    success:true,
                    data:getData
                  } 
                }
            } else
              throw new Error(
                `${user.email} exists in database that is not of the current user.`,
              );
          // }
        }
        throw new Error('User not found!');
      } else {
        throw new Error(validBody.data);
      }
    } catch (Error) {
      return { success: false, data: Error.message};
    }
  }

  async deleteUser(ConsID: string): Promise <CRUDReturn> {
    var userData = await this.DB.collection("users").doc(ConsID).get();
    
    
    if(await this.validateID(ConsID)){
      await this.DB.collection('users').doc(ConsID).delete();
      console.log('success');
      return {success: true,
        data: userData.data(),
      };
    }
    else{
      return {success: false,
        data: 'User not found.',
      };
    }
  }

  async loginUser(body: any): Promise<CRUDReturn> {
    try{
      var userResult = await this.DB.collection("users").where("email","==", body.email).get();
    var dbData = await this.DB.collection("users").get();
      var returnUser:Array<any> = [];
      if(!userResult.empty){
        dbData.forEach((doc)=>{
          if(doc.data()["password"] == body.password){
            console.log(doc.data()["email"],doc.data()["password"]);
            returnUser.push(doc.data()["name"],doc.data()["email"],doc.data()["age"],doc.data()["password"]);
          }
        }
        );
      }
      else{
          return{
            success: false,
            data: 'Login Credentials does not match any users in the database.'
          }
        }
        console.log(returnUser.length);
        if(returnUser.length>0){
            return {
            success: true,
            data: returnUser,
          };
        }
        else{
          return{
            success: false,
            data: 'Login Credentials does not match any users in the database.'
          }
        }
      
      
  
  }
  catch(error){
    return{
      success: false,
      data: error.message
    }
  }
  }

  async searchTerm(term: string): Promise<CRUDReturn> {
    
    var keys: Array<string> = Helper.describeClass(User);
    keys = Helper.removeItemOnce(keys, 'password');

    var dbData = await this.DB.collection("users").get();
      var returnUser:Array<any>= [];
        dbData.forEach((doc)=>{
          if(doc.data()["id"] == term || doc.data()["name"] == term || doc.data()["email"] == term || doc.data()["age"] == term){
            returnUser.push(doc.data());
          }
        });

        if(returnUser.length>0){
            return {
            success: true,
            data: returnUser,
          }
        }
        else{
          return {
            success: false,
            data: `${term} does not match any users in database!`,
          }
        }
      }

    // var userType:Array<User> = [];
    // const snapshot = await this.getAllUserObjects();
    // snapshot.forEach((doc) => {
    //     userType.push(doc)
    // });

    // var matchedData = [];
    // for (const iter of userType.values()) {
    //   for (const key of keys) {
    //     if (`${iter[key]}` === term) {
    //       matchedData.push(iter);
    //     }
    //   }
    // }
    // if (matchedData.length > 0) {
    //   return { success: true, data: matchedData };
    // } else {
    //   return {
    //     success: false,
    //     data: `${term} does not match any users in database!`,
    //   };
    // }
    

  async validateID(ID:string): Promise <boolean> {
    var dbData = await this.DB.collection("users").get();
      var count:number = 0;
      
        dbData.forEach((docs)=>{
          if(docs.id == ID){
            count = 1;
          }
        });
      if(count == 1)return true;
      else return false;
    
  }
  async emailExists(email: string): Promise <boolean> {

      var userResult = await this.DB.collection("users").where("email","==", email || "").get();
      console.log(userResult.size);

      if(userResult.size>0){
        for(const doc of userResult.docs){
          if(doc.data()['email'] === email)
            return true;
        }
      }
      else{
        return false;
      }
  
  }

  async pushToDB(newUser: User): Promise<boolean> {
    try {
      var result = await newUser.commit();
      return result.success;
    } catch (error) {
      console.log(error);
      return false;
    }
    // var userID: string = Helper.generateUID();
    //   if(newUser){
    //     this.users.set(userID,newUser);
    //     return 'User added to the database.';
    //   }
  }

  countBody(body: any, count: number) {
    count = 0;
    for (const key of Object.keys(body)) {
      if (key.includes(`${key}`)) {
        count++;
      }
    }
    return count;
  }
}

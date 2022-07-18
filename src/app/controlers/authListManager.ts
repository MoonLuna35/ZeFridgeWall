import { User, UserForAuthList } from "src/models/user/user";

export class AuthListManager {
    onAuthChange(auth: UserForAuthList[]): {auth_list: string, user: User[]} {
    
        let auth_str = "";
        let user_auth: User[] = [];
        for(let i = 0; i < auth.length; i++) {
          auth_str += auth[i].id + ";";
          user_auth.push(new User({
            id: auth[i].id
          }))
          
        }
        return {auth_list: auth_str, user: user_auth};
      }
}
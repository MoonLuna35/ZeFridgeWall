import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { List } from './list';
import { ListLine } from './list-line';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  baseUrl = "http://localhost/OurFridgeWall/list/list/";
  
  constructor(private http: HttpClient) { }

  selectLists(already_printed: number, is_archived: boolean | undefined = undefined): Observable<any> {
    let payload = {}; 
    if(typeof is_archived === "boolean") {
      payload = {
        data: {
          is_archived: is_archived,
          already_printed: already_printed
        }
      } 
    } 
    else {
      payload = {
        data: {
          already_printed: already_printed
        }
      } 
    }
    return this.http.post(`${this.baseUrl}select-lists`,payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }

  //auth :
  selectHouse(): Observable<any> {
    return this.http.get(`${this.baseUrl}get-user-mode-add`, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    ); 
  }

  selectHouseEditMod(list: List): Observable<any> {
    let payload = {
      data: {
        list: {
          id: list.id
        }
      }
    } 
    return this.http.post(`${this.baseUrl}get-user-mode-edit`,payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    ); 

  }

  modifyAuth(list: List): Observable<any> {
    let user_auth_id = [];
    if(list.user_auth?.length) {
      for(let i = 0; i < list.user_auth?.length; i++) {
        user_auth_id.push({id: list.user_auth[i].id});
      } 
    }
    let payload = {
      data: {
        list: {
          id: list.id,
          users_auth: user_auth_id
        }
      }
    } 
    return this.http.post(`${this.baseUrl}modify-auth`,payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    ); 

  }

  toPublic(list: List): Observable<any> {
    let payload = {
      data: {
        list: {
          id: list.id
        }
      }
    } 
    return this.http.post(`${this.baseUrl}to-public`,payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    ); 

  }
  //fin auth

  archive(list: List): Observable<any> {
    let payload = {
      data: {
        list: {
          id: list.id
        }
        
      }
    }
    return this.http.post(`${this.baseUrl}archive`,payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    ); 
  }

  unarchive(list: List): Observable<any> {
    let payload = {
      data: {
        list: {
          id: list.id
        }
      }
    }
    return this.http.post(`${this.baseUrl}unarchive`,payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    ); 
  }


  addList(list: List): Observable<any> {
    let user_auth_id = [];
    if(list.user_auth?.length) {
      for(let i = 0; i < list.user_auth?.length; i++) {
        user_auth_id.push({id: list.user_auth[i].id});
      } 
    }
    
    let payload = {
      data: {
        list: {
          name: list.name,
          desc: list.desc,
          users_auth: user_auth_id,
          is_private: list.is_protected
        }
      }
    };
    return this.http.post(`${this.baseUrl}new-list`, payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    ); 
  }

  loadList(list: List): Observable<any> {
    let payload = {
      data: {
        list: {
          id: list.id
        }
      }
    }

    return this.http.post(`${this.baseUrl}get-list`,payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    ); 
  }

  push(list: List, line: ListLine): Observable<any> {
    let payload = {
      data: {
        list: {
          id: list.id,
          product: {
            label: line.label
          }
        }
      }
    }
    return this.http.post(`${this.baseUrl}push`,payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    ); 
  }

  rename(list: List): Observable<any> {
    let payload = {
      data: {
        list: {
          id: list.id,
          name: list.name
        }
      }
    }
    
    return this.http.post(`${this.baseUrl}rename`,payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    ); 
  }

  update_qte(list: List): Observable<any> {
    let payload = {
      data: {
        list: {
          id: list.id,
          product: {
            id: list.lines[0].id,
            qte: list.lines[0].qte
          }
        }
      }
    }
    return this.http.post(`${this.baseUrl}update-qte`,payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    ); 
  }
  pop(list:List, i: number): Observable<any> {
    let payload = {
      data: {
        list: {
          id: list.id,
          product: {
            id: list.lines[i].id,
          }
        }
      }
    }
    return this.http.post(`${this.baseUrl}remove-line`,payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    ); 
  }
  askDeleteToken(list: List): Observable<any> {
    let payload = {
      data: {
        list: {
          id: list.id
        },
        token: ""
      }
    }
    return this.http.post(`${this.baseUrl}remove`,payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    ); 
  }

  deleteWithToken(list: List, token: String): Observable<any> {
    let payload = {
      data: {
        list: {
          id: list.id
        },
        token: token
      }
    }
    return this.http.post(`${this.baseUrl}remove`,payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    ); 
  }
}

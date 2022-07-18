import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ListLine } from '../list/list-line';

import { map } from 'rxjs/operators';
import { ListArticle } from '../list-article/list-article';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { ListTypeGen } from '../list-type/list-type-gen';
import { List } from '../list/list';
import { Observable } from 'rxjs';
import { CupboardLine } from './cupboard-line';
@Injectable({
  providedIn: 'root'
})
export class ListCupboardService {

  baseUrl = "http://localhost/OurFridgeWall/list/cupboard/";
  

  constructor(private http: HttpClient, 
    private userService: UserService) { }

  push_cupboard(article : ListArticle|ListLine): Observable<any> {
    let payload = {
      data: {
        product: article
      }
    };
    return this.http.post(`${this.baseUrl}push_cupboard`, payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }

  pop_cupboard(cupboardLine : ListLine): Observable<any> {
    let payload = {
      data: {
        product: cupboardLine
      }
    };
    return this.http.post(`${this.baseUrl}pop_cupboard`, payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }

  update_cupboard_line(line: ListLine): Observable<any> {
    let payload = {
      data: {
        product: line
      }
    };
    return this.http.post(`${this.baseUrl}update-qte`, payload, {withCredentials: true}).pipe(
      map((res: any) => {
      return res['data'];
      })
    );
  }


  getArticlesInCupboard(): Observable<any> { 
    return this.http.post(`${this.baseUrl}articles_in_cupboard`, { }, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }

  select_cupboard_for_fusion(list: List): Observable<any> {
    let payload = {
      data: {
        list: {
          id: list.id
        }
      }
    };
    return this.http.post(`${this.baseUrl}cupboard-from-list`, payload, {withCredentials: true}).pipe(
      map((res: any) => {
      return res['data'];
      })
    );
  }

  fuse(list: List, cupboardToAdd: CupboardLine[]): Observable<any> {
    let cupboard:Array<{id: number, qte: number}> = []
    let payload: {data: {
                    list: {
                      id: number,
                    },
                    cupboard: any[]
                  }};
    for(let i = 0; i < cupboardToAdd.length; i++) {
      cupboard.push({
        id: cupboardToAdd[i].id,
        qte: cupboardToAdd[i].qte
      });
    }
    payload = {
      data: {
        list: {
          id: list.id,
        },
        cupboard
      }
    };
    return this.http.post(`${this.baseUrl}fuse`, payload, {withCredentials: true}).pipe(
      map((res: any) => {
      return res['data'];
      })
    );

  }
}

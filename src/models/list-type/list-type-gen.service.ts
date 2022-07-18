import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { ListTypeGen } from './list-type-gen';

@Injectable({
  providedIn: 'root'
})
export class ListTypeGenService {
  arr= {}
  baseUrl = "http://localhost/OurFridgeWall/list/type/";
 

  constructor(private http: HttpClient) { }
  
  getAllTypes(printed: number) {

    let payload = 
    {
      data: {
        type_printed: printed
      }
    } 
    return this.http.post(`${this.baseUrl}get-types`, payload, {withCredentials: true, responseType: 'json'}).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }

  getTypeImg() {
    return this.http.get(`http://localhost/media/type_patern/list_img.json`).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }

  getTypeById(type_to_send: ListTypeGen) {
    
    let payload = 
    {
      data: {
        type: {
          id: type_to_send.id
        }
      }
    } 
    return this.http.post(`${this.baseUrl}get-by-id`, payload, {withCredentials: true, responseType: 'json'}).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }

  addType(type: ListTypeGen) {
    let payload = 
    {
      data: {
        type: {
          name: type.name,
          logo_color: "" + type.color,
          logo_patern: type.logo_patern
        }
      }
    } 
    console.log(payload);
    return this.http.post(`${this.baseUrl}add`, payload, {withCredentials: true, responseType: 'json'}).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }

  editType(type: ListTypeGen) {
    let payload = 
    {
      data: {
        type: {
          id: type. id, 
          name: type.name,
          logo_color: "" + type.color,
          logo_patern: type.logo_patern
        }
      }
    } 
    return this.http.post(`${this.baseUrl}edit`, payload, {withCredentials: true, responseType: 'json'}).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }

  remove(type: ListTypeGen) {
    let payload = 
    {
      data: {
        type: {
          id: type. id
        }
      }
    } 
    return this.http.post(`${this.baseUrl}remove`, payload, {withCredentials: true, responseType: 'json'}).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }
}

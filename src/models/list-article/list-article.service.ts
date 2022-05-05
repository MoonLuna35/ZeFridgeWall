import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { ListArticle } from './list-article';
import { ListLine } from '../list/list-line';
@Injectable({
  providedIn: 'root'
})
export class ListArticleService {

  baseUrl = "http://localhost/ZeFridgeWall/list/product/";

  constructor(
    private http: HttpClient) { }

  getAddedArticle(article : ListArticle|ListLine) {
    let payload = {
      data: {
        product: {
          label: article.label
        }
      }
    } 
    return this.http.post(`${this.baseUrl}article_is_in_db`, payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }

  add_new_article(article: ListArticle) {
    let payload = { 
      data:  {
          product: {
              label: article.label,
              type: {
                  id: article.type?.id
              },
              unity: article.unity
          }
          
      }
    }
    return this.http.post(`${this.baseUrl}add_article`, payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }

  getArticleByid(article : ListArticle|ListLine) {
    let payload = {
      data: {
        product: {
          id: article.id
        }
      }
    } 
    return this.http.post(`${this.baseUrl}get-by-id`, payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
        
      })
    );
  }

  editArticle(article: ListArticle) {
    let payload = { 
      data:  {
          product: {
              id: article.id,
              label: article.label,
              type: {
                  id: article.type?.id
              },
              unity: article.unity
          }
          
      }
    }
    return this.http.post(`${this.baseUrl}edit`, payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }

  delArticle(article: ListArticle, token: String = "") {
    let payload = { 
      data:  {
          product: {
              id: article.id
          },
          validate_token: token
      }
    }
    return this.http.post(`${this.baseUrl}delete`, payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }

  searchArticle(label: String) {
    let payload = { 
      data:  {
          product: {
              label: label          
          },
      }
    }
    return this.http.post(`${this.baseUrl}search-article`, payload, {withCredentials: true}).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }
}

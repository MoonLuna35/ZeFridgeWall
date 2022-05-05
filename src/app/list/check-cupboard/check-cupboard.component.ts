import { Component} from '@angular/core';
import { NavigationStart } from '@angular/router';

import { ListCupboardService } from 'src/models/list-cupboard/list-cupboard.service';
import { ListLine } from 'src/models/list/list-line';

import { ListArticleService } from "../../../models/list-article/list-article.service"
import { ListArticle } from "../../../models/list-article/list-article"

import { Router } from '@angular/router';
import { Event as NavigationEvent,  } from "@angular/router";

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { ListTypeGen } from 'src/models/list-type/list-type-gen';



@Component({
  selector: 'app-art',
  templateUrl: './check-cupboard.component.html',
  styleUrls: ['./check-cupboard.component.css'],

})
export class CheckCupboardComponent  {
  private articles: ListArticle[] = [];
  error = '';
  success = '';
  added_article = new ListArticle ({id:-1, label: "", type: new ListTypeGen({}), user:1, unity:""});
  edit_article = new ListArticle ({id:-1, label: "", type: new ListTypeGen({}), user:1, unity:""});
  _ctrl = false;
  _working = false;

  error_name = false;
  already_article = false;
  is_in_dialog = false;

  clear_article = false;

  in_edit = -1;

  products: ListLine[] = [];
  dialog_is_open =false;
  back_is_pressed =false;
  url: string = "http://localhost:4200/list/check-cupboard";
  
  constructor(
    private articleService: ListArticleService,
    private cupboardService: ListCupboardService,
    private router: Router,
    public sanitizer: DomSanitizer
    
    ) {
      this.getArticlesInCupboard()
      //On voit le retour
      router.events
			.pipe(
				filter(
					( event: NavigationEvent ) => {
						return( event instanceof NavigationStart );
					}
				)
			)
			.subscribe(
				( event: any ) => { //QUAND l'utilisateur a clique sur valider 

          if (
            router.getCurrentNavigation()?.extras.state !== undefined //Le dialog a renvoyer des trucs 
            && 
            event.url === '/lists/check-cupboard'
            &&
            router.getCurrentNavigation()?.extras.state?.article !== undefined 
            && 
            router.getCurrentNavigation()?.extras.state?.status  !== undefined 
            &&
            router.getCurrentNavigation()?.extras.state?.from  === undefined 
            &&
            router.getCurrentNavigation()?.extras.state?.status === "ok"
          ) {//si il a revoyer okconsole.log(this.added_article);
            this.added_article = new ListArticle(router.getCurrentNavigation()?.extras.state?.article); 
            this.getArticle(); 
            
          }
          if (
            router.getCurrentNavigation()?.extras.state !== undefined //Le dialog a renvoyer des trucs 
            && 
            event.url === '/lists/check-cupboard'
            &&
            router.getCurrentNavigation()?.extras.state?.article !== undefined 
            && 
            router.getCurrentNavigation()?.extras.state?.status  !== undefined 
            &&
            router.getCurrentNavigation()?.extras.state?.from  !== undefined 
            &&
            router.getCurrentNavigation()?.extras.state?.from === "edit"
            &&
            router.getCurrentNavigation()?.extras.state?.status === "ok"
          ) {//si il a revoyer okconsole.log(this.added_article);
            this.edit_article = new ListArticle(router.getCurrentNavigation()?.extras.state?.article); 
            this.editArticle(); 
            
          }
        
				}
			)
		;


    }
   
    /*
    * DANS CETTE FONCTION : 
    * On compare le nom des article pour les classé par ordre alphabétique 
    * 
    * */
     compareFirstNames(a: ListLine, b: ListLine ) {
      
      
      if (typeof a.label?.toString() === "string" && typeof b.label?.toString() === "string") { //SI le type est bon ALORS
        
        var av = a.label?.toString(); //On les converti en string
        var bv = b.label?.toString();
        if ( av < bv ){ //On classe
          return -1;
        }
        if ( av > av ){
          return 1;
        }
      }
      return 0;
    }
    
    

   /*
  Au chargement de la page, on regarde les produits dans le placards de l'utilisateur
   */
  getArticlesInCupboard() {
    this.products = [];
    this.cupboardService.getArticlesInCupboard().subscribe(
      (res: any) => {
       
        let cupboardLine: ListLine[] = res.cupboard;
        
        if (cupboardLine && cupboardLine[0] !== undefined) { //Si il y a des produit ALORS
          
          if ((cupboardLine[0].label !== undefined && cupboardLine[0].type !== undefined)) {
            
            this.products = cupboardLine; //On les prends 

            for(let i = 0; i < this.products.length; i++) {
              this.products[i].type = new ListTypeGen({
                logo_color: res.cupboard[i].type.logo_color,
                logo_patern: res.cupboard[i].type.logo_patern
            })
            }
            
          }     
        }
        },
            (err) => { //SINON
              console.log(err.message); //On indique une erreur http.
              this.error = err.message;
              this.router.navigate(["/door"]);
            }
          
    );
  }

  /*DANS CETTE FONCTION :
  *
  * On regarde si l'article qu'on veux ajouter est présent dans la base de donnée
  * Si il y est, on l'a          //this.openAlertDialog();  //On ouvre un dialog pour ajouter le nouvel article.joute au placards
  * Sinon on ouvre le dialog qui permet de l'ajouter
  * 
  * */
  getArticle() {
    //On demande au serveur
    this.articleService.getAddedArticle(this.added_article).subscribe(
      (res: any) => {
        //SI l'article n'est pas présent dans la base des articles ALORS
        if (res.product?.id === undefined) {
          this.router.navigateByUrl("lists/check-cupboard/add", 
          {
            state: {
              article: this.added_article.label
            }
          });
          this.error_name = false;
          this.already_article = false;
          this._ctrl = false;
          this._working = false;
        }
        else { //SINON
          //SI il n'est pas déjà à vérifier dans le placards
          let product_to_add:any  = res.product;
          var is_in_cup = false;
          for (var i=0; i < this.products.length && !is_in_cup; i++) { //POUR TOUT produit FAIRE
            if (this.products[i].id === product_to_add.id) { //SI le produit courant est déjà à controler dans le placards
                is_in_cup = true; //On sort de la boucle
                this.error_name = true;
                this.already_article =true;
                this._ctrl = false;
                this._working = false;
                
            }
          }
          if (!is_in_cup) { //SI il n'est pas encore dans les produit à controler dans le placards
            this.cupboardService.push_cupboard(product_to_add).subscribe( //On l'ajoute au placard dans la base de donnée.
            (resCup: any) => { //SI il n'y aucune erreur 
              if (resCup.status !== undefined && resCup.status === "ok") {
                product_to_add.type = new ListTypeGen(product_to_add.type);
                this.products.push(product_to_add);//on l'ajoute dans la vue.
                this.products.sort(this.compareFirstNames);
                this.clear_article = true;
                this.added_article.label="";
                this.error_name = false;
                this.already_article = false;
              }
              else if (resCup.error !== undefined) {
                  this.error_name = true;
              }
              this._ctrl = false;
              this._working = false;
            }
            );
          }
        }
      },
      (err) => { //SI le serveur renvoie une erreur http lorqu'on lui a demander si l'article était dans la base d'articles
        console.log(err.message); //On l'indique
        this.error = err.message;
        this._ctrl = false;
        this._working = false;
      }
    );
  }

  check_article(article: ListArticle) {
    console.log(article);
    this.added_article = article;
    this.getArticle();

  }

  editArticle() {
    let l:any = this.edit_article
    if(l.id !== undefined) {
      this.products[this.in_edit] = l;
    }
    else {
      this.products.splice(this.in_edit, 1);
    }
    this.products.sort(this.compareFirstNames);
  }

  read_msg(msg:string) {
    console.log(msg);
    if(msg ==="article cleared") {
      this.clear_article = false;
      this.error_name = false;
    }
  }


  /*DANS CETTE FONCTION :
  *
  * On suprime la ligne : dans la vue et dans la base de donnée
  * 
  * i représente l'indice de la ligne
  * 
  * */

  delete(event: Event, i: number)  {
    var line:ListLine = this.products[i]; //On prends la ligne i
    
    this.products.splice(i, 1); //On supprime la ligne i de la vue
    this.cupboardService.pop_cupboard(line).subscribe( //On appele le serveur pour qu'il supprime la ligne dans la base de donnée
      (res: any) => {
      },
    (err) => { //SI il renvoie une erreur
      console.log(err.message); //On l'affiche
    }
    );

  }

  /*DANS CETTE FONCTION :
  *
  * On modifie la quantité de la ligne i
  * 
  * i représente l'indice de la ligne
  * 
  * */
  update(i: number, event: any) {
    var line:ListLine = this.products[i]; //On prends la ligne i
    if (event.target.value !== "" && event.target.value > 0) {
      
      line.qte = event.target.value;
      this.cupboardService.update_cupboard_line(line).subscribe( //On appele le serveur pour qu'il supprime la ligne dans la base de donnée
      (res: any) => {
        event.target.className =  "num";
      },
      (err) => { //SI il renvoie une erreur
        console.log(err.message); //On l'affiche
        this.error = err.message;
      }
    );
    }
    else {
      event.target.className =  "num input_red ";
    }
    
  }

 

  ngOnInit() {
  }


}

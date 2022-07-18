import { Component, OnInit, Inject, ComponentFactoryResolver, Injectable } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListTypeGenService } from "../../../../models/list-type/list-type-gen.service"
import { ListTypeGen } from "../../../../models/list-type/list-type-gen"
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListArticleService } from 'src/models/list-article/list-article.service';
import { ListArticle } from 'src/models/list-article/list-article';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, Event as NavigationEvent, RouterEvent, Route} from '@angular/router';
import { Location } from '@angular/common';

import { HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';


@Injectable()
export class ArticleBase {
  articleForm: FormGroup; //Le formulaire

  metric = true; //Savoir si on est en metrique
  article_name: string = ""; //Le nom de l'article a ajouter
  types: ListTypeGen[] = []; //La liste qui contiendra les types
  _working = false; //Si on a cliquer sur ajouter

  selected_type = -1; //Le type selectionne

  selected_type_i = -1; //Quand on clique sur le type, on garde son index
  
  name_already_used = false; //Si le nom est deja utilise

  edit= false; //si on edite ou qu'on ajoute
  add=true;
  
  unity_selected = "g";

  protected ALPHANUM_PATERN = "^[a-zA-Z0-9-_ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØŒŠþÙÚÛÜÝŸàáâãäåæçèéêëìíîïðñòóôõöøœšÞùúûüýÿ ]+$" //La regex pour prende que les caracteres alphanumeriques
  article: ListArticle = new ListArticle ({ 
    id: -1,
    label: "", 
    type: new ListTypeGen ({
      id:-1
    }), 
    unity: ""
  });
  parent_route: any[]= [];
  parent_url = "";

  constructor(
    protected listTypeGenService: ListTypeGenService ,
    protected formBuilder: FormBuilder,
    protected articleService: ListArticleService,
    protected router: Router,
    public dialogRef:MatDialog
     
    )
     {
  
    this.getType(); //On obtiens les type
    
    this.articleForm = this.formBuilder.group({ //On crée le formulaire
      name: ["", Validators.compose([Validators.required, Validators.pattern(this.ALPHANUM_PATERN)])],
      unity: ['cl', Validators.required],
      type: [-1, Validators.required]
    });
    this.get_parent_route();
    
  }

  protected get_parent_route() {
    if (this.router.url.match("edit-list")) {
      let id = this.router.url.match("[0-9]+");
      if (id) {
        this.parent_route = ["/lists/edit-list", id[0]];
        this.parent_url = "/lists/edit-list/" + id[0];
      }
    }
    else {
      
      this.parent_route = ["/lists/check-cupboard"];
      this.parent_url = "/lists/check-cupboard";
    }
  }

  set_i_j_of_type(i: number, j: number) {
    this.selected_type_i = i;
  }

  open_edit(type: number | undefined) {
  }

  open_add() {
    
  }

  delete() {
    
  }

  compareType(a: ListTypeGen, b: ListTypeGen ) {
      
      
    if (typeof a.name?.toString() === "string" && typeof b.name?.toString() === "string") { //SI le type est bon ALORS
      
      var av = a.name?.toString(); //On les converti en string
      var bv = b.name?.toString();
      if ( av < bv ){ //On classe
        return -1;
      }
      if ( av > av ){
        return 1;
      }
    }
    return 0;
  }

    /*DANS CETTE FONCTION : 
  *
  * On vide les types vue que l'utilisateur a cliquer pour les modifiee donc une fois fini ils devront erte recharges
  * 
  * */
    public dump_type() {
      this.types = []; 
    }

    reset_err() {
      this.name_already_used = false;
    }
    
    /*DANS CETTE FONCTION : 
    *
    * On obtiens les type de l'utilisateurs et les types sugérés
    * 
    * */
    protected getType() {
      
      this.listTypeGenService.getAllTypes(0).subscribe(
        (res: any) => { //On appel le serveur
          if (res.types) {
            
            if (res.types.length > 0) {
              for(let i = 0; i < res.types.length; i++) {
                this.types.push(new ListTypeGen(res.types[i]));
              }
              this.types.sort(this.compareType);
            }
    
            if(this.selected_type === -1) {
              this.articleForm.patchValue({type: "" + this.types[0].id}); //On selectionne le type et l'unité
            }
            else {
              this.articleForm.patchValue({type: "" + this.selected_type}); //On selectionne le type et l'unité
            }
            
            this.types[0].color_to_hex; //On les affiches
            
          }
          
        },
        (err) => { //SI il y a des erreurs ALORS
          console.log(err); //On les affiches
        }
      );
    }
    set_state() {
      history.replaceState({ navigationId: history.state.navigationId, article: this.articleForm.controls['name'].value}, "")
    }
}

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent extends ArticleBase implements OnInit {
  
  dialog_is_open =false;
  url: string = "http://localhost:4200/list/check-cupboard";
  add_type =false;

  constructor(
    protected listTypeGenService: ListTypeGenService ,
    protected formBuilder: FormBuilder,
    protected articleService: ListArticleService,
    protected router: Router,
    public dialogRef:MatDialog,
    
    ) {
        super(listTypeGenService, formBuilder, articleService,router, dialogRef);

        //ECOUTER la route
        router.events.pipe(filter(
					( event: NavigationEvent ) => {
            
						return( event instanceof NavigationStart );
 
					}
				)
			)
			.subscribe( //QUAND la route change
				( e: any ) => {
          
          if ( //SI elle viens de edit type 
          e.url.match('/add/article/edit-type') 
          && //et
          router.getCurrentNavigation()?.extras.state !== undefined //que edit type a renvoyer quelque chose
          ) {
            if (router.getCurrentNavigation()?.extras.state?.data !== "delete") { //SI il n'a pas renvoyer "supprimer" ALORS
              this.types = router.getCurrentNavigation()?.extras.state?.data; //On modifie le type 
            }
            else { //SINON
              this.types.splice(this.selected_type_i, 1); //On supprime le type
              this.articleForm.patchValue({type: "" + this.types[0].id});
            }
            
              
          }
				}
			)
		;
    }
  /*
  * DANS CETTE FONCTION : 
  * On ajoute l'article à la base de donnée
  */
  add_article() {
    
    this.articleService.add_new_article(this.article).subscribe(
        (res: any) => { //On appelle de serveur 
          if (res.error) { //SI il renvoie une erreur nomée alors 
            if(res.error === "article dupliced") { //SI c'est que l'article est duplique ALORS 
              this.name_already_used = true; //On indique 
            }
            else { //SINON
              //this.dialogRef.close(res.data.error); //On ferme le dialog en envoyant l'erreur
             
              this.router.navigateByUrl(this.parent_url, { state: { error: res.data.error } });
              this.dialogRef.closeAll();
            }
          }
          else if(res.product) { //SINON
            let article: ListArticle =  res.product; //On type la réponse
            if (article.label) { //SI le format est correct ALORS
              //this.dialogRef.close(article); //On ferme le dialog en envoyant l'article
              console.log(this.parent_url);
              this.router.navigateByUrl(this.parent_url, { state: { status:'ok',article: article } });
              this.dialogRef.closeAll();
            }
          }
          else { //SINON
            //this.dialogRef.close("underknow"); //On ferme le dialog en enoyant une erreur inconnue
            this.router.navigateByUrl(this.parent_url, { state: { error: 'underknow' } });
            this.dialogRef.closeAll();
          }
          this._working = false;
        },
        (err) => { //SI il y a une erreur http
          console.log(err.message); //On l'affiche
          this.dialogRef.closeAll();
        }
        
    );
  }


 /*
  * QUAND l'utilisateur valide : 
  * On gère les données pour les envoyer
  */
  public onSubmit(event: Event) {
    event.preventDefault();
    
    if (this.articleForm.valid === true) { //SI le formulaire est valide ALORS
      this._working = true;
      this.article.label = this.articleForm.value["name"]; //On modifie les valeurs de l'article à ajouter
      this.article.unity = this.articleForm.value["unity"];
      this.article.type = new ListTypeGen({ id: parseInt(this.articleForm.value["type"])});
      
      this.add_article(); //On ajoute l'article à la base de donnée
       

      
    } //SINON 
    //On affiche le message
    
  }

  ngOnInit() {
    this.articleForm.patchValue({name: history.state.article});
    if (history.state.type !== undefined) {
      this.selected_type = history.state.type;
    }
  }
}

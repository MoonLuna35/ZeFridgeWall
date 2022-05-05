 import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ListArticle } from 'src/models/list-article/list-article';
import { ListTypeGen } from 'src/models/list-type/list-type-gen';
import { ListService } from 'src/models/list/list.service'; 
import { ListBaseComponent } from '../list/list.component';
import { Event as NavigationEvent,  } from "@angular/router";
import { ListArticleService } from 'src/models/list-article/list-article.service';
import { ListLine } from 'src/models/list/list-line';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { List } from 'src/models/list/list';
import { CupboardLine } from 'src/models/list-cupboard/cupboard-line';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['../list/list.component.css', './edit-list.component.css']
})
export class EditListComponent extends ListBaseComponent {
  clear_article = false;
  error_name = false;
  
  added_article: ListLine = new ListLine ({id:-1, label: "", type: new ListTypeGen({}), user:1, unity:""});
  edit_article = new ListLine ({id:-1, label: "", type: new ListTypeGen({}), user:1, unity:""});
  
  list_to_edit: List = new List({
    id: -1,
    name: "",
    desc: "",
    date_create: new Date(),
    is_archived:false,
    is_protected: false,
    lines:[]
  })

  _ctrl = false;
  _working = false;
  already_article = false;
  private listLineTofuse: Array<ListLine> = []

  
  
  constructor(
    protected route: ActivatedRoute,
    protected listService: ListService,
    protected articleService: ListArticleService,
    protected router: Router,
    protected formBuilder: FormBuilder,
    
  ) {  
    super(route, listService, router, formBuilder);


    
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
            event.url.match('/lists/edit-list')
            &&
            router.getCurrentNavigation()?.extras.state?.article !== undefined 
            && 
            router.getCurrentNavigation()?.extras.state?.status  !== undefined 
            &&
            router.getCurrentNavigation()?.extras.state?.from  === undefined 
            &&
            router.getCurrentNavigation()?.extras.state?.status === "ok"
          ) {//si il a revoyer ok
            
            this.added_article = new ListLine(router.getCurrentNavigation()?.extras.state?.article); 
            this.push_new_article()
            
          }
          else if (
            router.getCurrentNavigation()?.extras.state !== undefined //Le dialog a renvoyer des trucs 
            && 
            event.url.match('/lists/edit-list')
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
            this.edit_article = new ListLine(router.getCurrentNavigation()?.extras.state?.article); 
            console.log(this.edit_article);
            this.editArticle(); 
            
          }
          else if (
            router.getCurrentNavigation()?.extras.state !== undefined //Le dialog a renvoyer des trucs 
            && 
            event.url.match('/lists/edit-list')
            && 
            router.getCurrentNavigation()?.extras.state?.data  !== undefined 
            &&
            router.getCurrentNavigation()?.extras.state?.from  !== undefined 
            &&
            router.getCurrentNavigation()?.extras.state?.from === "fuse"
          ) {
            for(let i = 0; i < router.getCurrentNavigation()?.extras.state?.data.length; i++) {
              let cupboardLine = router.getCurrentNavigation()?.extras.state?.data[i]
              this.listLineTofuse.push(new ListLine({
                id: cupboardLine.id,
                label: cupboardLine.label,
                qte: cupboardLine.qte, 
                type: cupboardLine.type,
                is_from_cupboard: true
              }));
              
            }
            this.fuseView();
            

           
            
          }          
				}
			)
		;

  }

  private push_new_article(): void {
    
    this.listService.push(this.list, this.added_article).subscribe( //On l'ajoute au placard dans la base de donnée.
              (resCup: any) => { //SI il n'y aucune erreur 
                if (resCup.line?.id !== undefined && this.added_article.type) {
                  console.log(resCup);
                  resCup.line.type = new ListTypeGen(resCup.line.type);
                  this.list.lines.push(resCup.line);//on l'ajoute dans la vue.
                  
                  this.clear_article = true;
                  this.added_article.label="";
                  this.error_name = false;
                  this.already_article = false;
                  this.list.lines.sort(this.compareFirstNames);
                  console.log("after sort");
                  console.log(this.list.lines);
                  this.listForm.setControl('lines', this.formBuilder.array(this.list.lines.map(item=>{
                    return this.createLine(item) 
                   })),
                  );
                  
                  console.log(this.listForm);
                   
                }
                else if (resCup.error !== undefined) {
                    this.error_name = true;
                }
                this._ctrl = false;
                this._working = false;
              }
              );

  }

  private reset_edit_list() :void {
    this.list_to_edit = new List({
      id: this.list.id,
      name: "",
      desc: "",
      date_create: new Date(),
      is_archived:false,
      is_protected: false,
      lines:[]
    })
  }

  private fuseView():void {
    for(let i = 0; i < this.list.lines.length; i++) {
      if(this.list.lines[i].is_from_cupboard === true) {
        this.list.lines.splice(i, 1);
        
        i--;
      }
    }
    for(let i = 0; i < this.listLineTofuse.length; i++) {
      this.list.lines.push(this.listLineTofuse[i]);
    }
    this.list.lines.sort(this.compareFirstNames);
    this.listForm.setControl('lines', this.formBuilder.array(this.list.lines.map(item=>{
      return this.createLine(item) 
     })),);
     this.listLineTofuse = [];
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

  delete(event: Event, i: number)  {
    this.listService.pop(this.list, i).subscribe( //On appele le serveur pour qu'il supprime la ligne dans la base de donnée
      (res: any) => {
        this.list.lines.splice(i, 1); //On supprime la ligne i de la vue
        this.listForm.setControl('lines', this.formBuilder.array(this.list.lines.map(item=>{
          return this.createLine(item) 
         })),
        );
      },
      
    (err) => { //SI il renvoie une erreur
      console.log(err); //On l'affiche
    }
    );
  }

  getControls() {
    return (this.listForm.get('lines') as FormArray).controls;
  }
  update_qte(event: any, i: number)  {
    this.reset_edit_list();
    let fa:any = this.listForm.controls.lines;
    if(
      fa.controls[i].valid 
      &&
      this.listForm.controls.lines.value[i]["qte"] !== this.list.lines[i].qte
    ) {
      this.list_to_edit.lines.push(new ListLine({
        id: this.listForm.controls.lines.value[i]["id"],
        qte: this.listForm.controls.lines.value[i]["qte"]

      }))
      this.listService.update_qte(this.list_to_edit).subscribe(
        (res: any) => {
          if(res.status !== undefined && res.status === "ok") {
            this.reset_edit_list();
          }
        },
        (err) => {
          console.log(err);
        }
      )
    }

    
  }
  rename(event: any)  {
    if(
      !this.listForm.controls['label'].invalid
      &&
      this.listForm.value['label'] !== this.list.name
    ) {
      this.reset_edit_list();
      this.list_to_edit.name = this.listForm.value["label"];
      this.listService.rename(this.list_to_edit).subscribe(
        (res: any) => {
          if(res.status !== undefined && res.status === "ok") {
            this.reset_edit_list();
          }
        },
        (err) => {
          console.log(err);
        }
      )
    }
  }
  check_article(article: ListArticle | ListLine | any) {
    this.added_article = article;
    this.getArticle();
  }

  editArticle() {
    let l:ListLine | string = this.edit_article;
    l.qte = this.list.lines[this.in_edit].qte;  
    if(l.id !== undefined) {
      this.list.lines[this.in_edit] = l;
    }
    else {
      this.list.lines.splice(this.in_edit, 1);
    }
    this.list.lines.sort(this.compareFirstNames);
    this.listForm.setControl('lines', this.formBuilder.array(this.list.lines.map(item=>{
      return this.createLine(item) 
     })),);
    
  }

    /*DANS CETTE FONCTION :
  *
  * On regarde si l'article qu'on veux ajouter est présent dans la base de donnée
  * Si il y est, on l'a          //this.openAlertDialog();  //On ouvre un dialog pour ajouter le nouvel article.joute au placards
  * Sinon on ouvre le dialog qui permet de l'ajouter
  * 
  * */
    private getArticle() {
      //On demande au serveur
      this.articleService.getAddedArticle(this.added_article).subscribe(
        (res: any) => {
          //SI l'article n'est pas présent dans la base des articles ALORS
          if (res.product?.id === undefined) {
            this.router.navigate(["lists/edit-list/"+ this.list.id +"/add"], 
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
            let product_to_add: ListLine  = res.product;
            var is_in_lsit = false;
            for (var i=0; i < this.list.lines.length && !is_in_lsit; i++) { //POUR TOUT produit FAIRE
              if (this.list.lines[i].id === product_to_add.id) { //SI le produit courant est déjà à controler dans le placards
                  is_in_lsit = true; //On sort de la boucle
                  this.error_name = true;
                  this.already_article =true;
                  this._ctrl = false;
                  this._working = false;
                  
              }
            }
            if (!is_in_lsit) { //SI il n'est pas encore dans les produit à controler dans le placards
              this.listService.push(this.list, product_to_add).subscribe( //On l'ajoute au placard dans la base de donnée.
              (resCup: any) => { //SI il n'y aucune erreur 
                if (resCup.line?.id !== undefined && product_to_add.type) {
                  
                  product_to_add.type = new ListTypeGen(product_to_add.type);
                  product_to_add.qte = 0;
                  this.list.lines.push(product_to_add);//on l'ajoute dans la vue.
                  this.list.lines.sort(this.compareFirstNames);
                  this.clear_article = true;
                  this.added_article.label="";
                  this.error_name = false;
                  this.already_article = false;
                  this.listForm.setControl('lines', this.formBuilder.array(this.list.lines.map(item=>{
                    console.log(item);
                    return this.createLine(item) 
                   })),);
                   
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
          this._ctrl = false;
          this._working = false;
        }
      );
    }

  /*CETTE FONCTION PERMET DE  :
  *
  * Determiner si la liste contients des lignes venant du placard
  * 
  * */
    private is_fused() {
      
    }
}

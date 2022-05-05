import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ListArticle } from 'src/models/list-article/list-article';
import { ListArticleService } from 'src/models/list-article/list-article.service';
import { ListTypeGen } from 'src/models/list-type/list-type-gen';
import { ListTypeGenService } from 'src/models/list-type/list-type-gen.service';
import { ArticleBase } from '../add-article-dialog/add-article/add-article.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog'
import { EditTypeComponent } from '../edit-type/edit-type.component';
import { AddTypeComponent, AddTypeForEditComponent } from '../add-article-dialog/add-type/add-type.component';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  template : ''
})


/**
 * Lorsqu'on ouvre le dialogue alors qu'il est route, on passe par un fake component
 * 
 */
export class EditArticleEntryComponent {
  private article: ListArticle = new ListArticle ({ 
    id: -1,
    label: "", 
    type: new ListTypeGen ({
      id:-1
    }), 
    unity: ""
  });

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    protected router: Router,
    protected articleService: ListArticleService,) {
      
      this.article.id =  parseInt(this.route.snapshot.paramMap.get("id") || "-1"); //on recupere l'id
      this.articleService.getArticleByid(this.article).subscribe( //On recupere les donnees du produit
        (res: any) => { 
          if(res.status !== undefined && res.status === "ok") { //SI tout vas bien ALORS
            this.article = new ListArticle(res.product);
            
            this.openDialog(); //On ouvre le dialogue avec les parameteres transmis par le serveur
          }
          else {
            //On affiche une info comme quoi le dialogue peut pas s'ouvrir pendant quelques secondes
          }
      });
         
        
  }
  openDialog(): void {
    
    const dialogRef = this.dialog.open(EditArticleComponent, 
      {
        panelClass: 'custom-modalbox',
        data: {
          article: this.article          
        }
    });
    
    dialogRef.afterClosed().subscribe(result => { //QUAND il se ferme
      this.router.navigate(['../..'], { relativeTo: this.route,state: { from: "edit", status:'ok',article: result }}); //On renvoie le resulat au parent
     });
  }
}


@Component({
  selector: 'app-edit-article',
  templateUrl: '../add-article-dialog/add-article/add-article.component.html',
  //templateUrl: './edit-article.component.html',
  styleUrls: ['../add-article-dialog/add-article/add-article.component.css', './edit-article.component.css']
})
export class EditArticleComponent extends ArticleBase implements OnInit {


  constructor(
    @Inject(MAT_DIALOG_DATA) public loaded_article: any,
    protected listTypeGenService: ListTypeGenService , 
    protected formBuilder: FormBuilder,
    protected articleService: ListArticleService,
    protected router: Router,
    public dialogRef:MatDialog,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public adialogRef: MatDialogRef<EditArticleComponent>,
    
    ) {
        super(listTypeGenService, formBuilder, articleService,router, dialogRef);
        this.edit=true;
        this.add=false;
        this.article.id = this.loaded_article.article.id;
        this.article.label = this.loaded_article.article.label;
  }

  public open_edit(type: Number | undefined) {
    
    const dialogRef = this.dialog.open(EditTypeComponent, //On ouvre le dialogue pour editer 
      {
        width: '550px',
        height:  "500px",
        panelClass: 'edit_type_dialog',
        data: {
          type: type
        }
    });
    dialogRef.afterClosed().subscribe(result => { //QUAND le dialogue se ferme
      if (result !== undefined) { //SI il a renvoyer quelque chose
          if (result !== "delete") { //SI il n'a renvoyer delete (il a renvoyer un type) ALORS
            this.types[this.selected_type_i]=result; //On modifie le type 
            this.types.sort(this.compareType); //On les tris
          }
          else {
            this.types.splice(this.selected_type_i, 1);
            this.articleForm.patchValue({type: "" + this.selected_type});
          }
        
      }
      
     });
  }

  public open_add() {
    
    const dialogRef = this.dialog.open(AddTypeForEditComponent, //On ouvre le dialogue permettant d'ajouter le type
      {
        width: '550px',
        height:  "500px",
        panelClass: 'edit_type_dialog'
    });
    dialogRef.afterClosed().subscribe(result => { //QUAND le dialogue se ferme 
      if (result !== undefined) { //SI il a renvoyer quelques choses 
          this.types.push(new ListTypeGen(result)); //On ajoute le type obtenue a la liste de type
          this.types.sort(this.compareType); //On les tris
          this.articleForm.patchValue({type: "" + result.id}); //On le selectionne
      }
      
      


     });
  }
/**
 * On confirme la suppression
 * 
 * @param token 
 * 
 */
  private confirm_del(token: string) {
    this.articleService.delArticle(this.article, token).subscribe(
      (res: any) => {
        if(res.status !== undefined && res.status === "ok") { //SI tout vas bien
          this.adialogRef.close("ok"); //On ferme le dialog en renvoyant Ok
        }
        else {
          this.adialogRef.close("nok");
        }
        
      }
    );
  }

  public delete() {
    this.articleService.delArticle(this.article).subscribe(
      (res: any) => {
        console.log(res);
        if(res.validate_token !== undefined) { //SI l'article est contenu dans une liste ou dans le placard (l'api a renvoyer un token ) ALORS
          const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, //On ouvre la confirmation 
            {
              panelClass: 'del_article_confirm',
              data: {
                res,
                article: this.article          
              }
          });
          dialogRef.afterClosed().subscribe(result => { //Quand il se ferme
            if(result) { //SI l'utilisateur a confirmer ALORS
              this.confirm_del(res.validate_token); //On envoie le token au serveur
            }
            
           });
        
        }
      }
    );
  }
 /**
  * On instanmcie le formulaire
  * 
  */
  ngOnInit(): void { 
    this.selected_type = this.loaded_article.article.type.id;
    this.unity_selected =this.loaded_article.article.unity;
    this.articleForm.patchValue({
      name: this.loaded_article.article.label, 
      unity: this.unity_selected});
    
  }

  /**
   * 
   * Quand on envoie pour editer
   * 
   */
   
  public onSubmit(event: Event) {
    event.preventDefault();
    
    if (this.articleForm.valid === true) { //SI le formulaire est valide ALORS
      let index_of_type = -1;
      let id = parseInt(this.articleForm.value["type"]);
      this._working = true;
      this.article.label = this.articleForm.value["name"]; //On modifie les valeurs de l'article à editer 
      this.article.unity = this.articleForm.value["unity"];
      //on recupere le patern et la couleur du type
      for (let i = 0; i < this.types.length; i++) {
        if (this.types[i].id === id) {
          index_of_type = i;
        }
      }
      this.article.type = new ListTypeGen({ 
        id: parseInt(this.articleForm.value["type"]),
        logo_color: this.types[index_of_type].color,
        logo_patern: this.types[index_of_type].logo_patern
      });
      
      
      this.articleService.editArticle(this.article).subscribe( //On tente de l'editer
        (res: any) => { //On appel le serveur
          if(res.status !== undefined && res.status === "ok") { //Si c'est bon
            this.adialogRef.close(this.article); //On renvoie l'article au parent
          }
          else if(res.error !== undefined && res.error === "article already exists") { //SI l'article existe exactement ALORS
            this.adialogRef.close(this.article); //On renvoie l'article au parent
          }
        }
      );
    }
    
  }
}

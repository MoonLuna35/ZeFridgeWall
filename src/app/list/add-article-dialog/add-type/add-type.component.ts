import { AfterViewInit, Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ListTypeGenService } from 'src/models/list-type/list-type-gen.service';
import {  Color } from '@angular-material-components/color-picker';
import { Router } from '@angular/router';
import { ListTypeGen } from 'src/models/list-type/list-type-gen';
import { Injectable } from '@angular/core' ;
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


@Injectable()
export class TypeBase {
  public foo = "";
  public color: ThemePalette = 'accent';
  public logos: any[] = [];
  public state: string;
  public type: ListTypeGen = new ListTypeGen ({})

  public _validators_alpha_req = [
    Validators.required,
    Validators.pattern("^[0-9a-zA-Z-âêîôûäëïöüàèâêîôûé_]+$"), 
    Validators.minLength(3)
  ];

  public _validators_hex = [
    Validators.required,
    Validators.pattern("^#[0-9abcdef]{6}$"), 
    Validators.maxLength(7),
    Validators.minLength(7),
  ];
 

  public typeForm: FormGroup;
  working = false;
  add = true;
  edit = false

  parent_route: any[]= [];
  parent_url = "";


  constructor(
    protected typeService: ListTypeGenService,
    protected formBuilder: FormBuilder,
    protected router: Router,
    protected dialogRef: MatDialog
    ) { 

      this.state = router.getCurrentNavigation()?.extras.state?.article; //On recupere l'article
      this.typeService.getTypeImg().subscribe(
        (res: any) => { //On appel le serveur
          if (res instanceof Array) { //SI on a bien une liste
            for(let i = 0; i < res.length; i++) { //POUR TOUT nom de logos FAIRE
              if(res[i].img !== undefined) { //SI le logo i contient bien le nom d'une image ALORS
                this.logos.push(res[i].img);//on l'ajoute au tableau de logo
              }
            }
            this.typeForm.patchValue({type: this.logos[0]});
          }
        }
      );
 
    this.typeForm = this.formBuilder.group({ //On crée le formulaire
      name: ['', Validators.compose( this._validators_alpha_req)],
      type: [this.logos[0], Validators.required],
      color: ['' ,  Validators.compose( this._validators_hex)]
    });

    this.get_parent_route();
    
  }

  protected get_parent_route() {
    if (this.router.url.match("edit-list")) {
      let id = this.router.url.match("[0-9]+");
      if (id) {
        console.log(id[0]);
        this.parent_route = ["/lists/edit-list", id[0]];
        this.parent_url = "/lists/edit-list/" + id[0];
      }
    }
    else {
      
      this.parent_route = ["/lists/check-cupboard"];
      this.parent_url = "/lists/check-cupboard";
    }
  }

  public delete_type() {
   
  }

  
  
  hexToRgb(hex: string) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }    


  public setColor(type: string, color: string) {
    switch (type) {
      case 'background':
        const temp = this.hexToRgb(color);
        if (temp) {
          this.typeForm.patchValue({color: new Color(temp.r, temp.g, temp.b)});
        }
        break;
    }
  }

}

@Component({
  selector: 'app-add-type',
  templateUrl: './add-type.component.html',
  styleUrls: ['./add-type.component.css']
})
export class AddTypeComponent extends TypeBase  {
  constructor(
    protected typeService: ListTypeGenService,
    protected formBuilder: FormBuilder,
    protected router: Router,
    public dialogRef: MatDialog
    
    ) {
      super(typeService, formBuilder, router, dialogRef);

     }
    
     public close() {
      this.dialogRef.closeAll();
    }
    /**
     * DANS CETTE FONCTION 
     * On ajoute le type
     * 
     */
  protected addType() {
    this.typeService.addType(this.type).subscribe(
      (res: any) => { //On appel le serveur
        if(res.type.id && this.router.url.search("/lists/check-cupboard/edit") === -1) { //SI il a renvoyer un truc
          this.router.navigateByUrl(this.parent_url + "/add/article", { //on renvoie le type
            state: { 
              article: this.state, 
              type: res.type.id
            } 
          }
          );
        }
        else {
            this.dialogRef.closeAll(); //SINON on ferme 
        }
        
      }
    );
  }


  onSubmit(event: Event) {
    event.preventDefault();
    this.working = true; 
    if (this.typeForm.valid === true) { //SI le formulaire est valide ALORS
      this.type = new ListTypeGen (
        {
          name: this.typeForm.get("name")?.value, 
          logo_color: this.typeForm.get("color")?.value,
          logo_patern: this.typeForm.get("type")?.value
        }
      );
      this.addType();

    
    } 
    
  }

}

@Component({
  selector: 'app-add-type',
  templateUrl: './add-type.component.html',
  styleUrls: ['./add-type.component.css']
})

/**
 * Pour editer l'article, on a besoin d'un retour different
 * 
 */
export class AddTypeForEditComponent extends AddTypeComponent  {
  constructor(
    protected typeService: ListTypeGenService,
    protected formBuilder: FormBuilder,
    protected router: Router,
    public dialogRef: MatDialog,
    public thedDialogRef: MatDialogRef<AddTypeForEditComponent>,
    
  ) {
    super(typeService, formBuilder, router, dialogRef);
  }
    
  /**
   * DANS CETTE FONCTION
   * On ajoute le le type
   * 
   */
  protected addType() {
    this.typeService.addType(this.type).subscribe(
      (res: any) => { //On appel le serveur
        if(res.type.id) { //si il renvoie un type ALORS
            this.thedDialogRef.close(res.type); //On l'envoie au parent
        }
        else { //SINON
          this.thedDialogRef.close(); //On renvoie rien 
        }
      }
    );
  }
}

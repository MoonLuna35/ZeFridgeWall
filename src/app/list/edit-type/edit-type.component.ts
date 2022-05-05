import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ListTypeGenService } from 'src/models/list-type/list-type-gen.service';
import { ListTypeGen } from 'src/models/list-type/list-type-gen';
import { TypeBase, AddTypeComponent } from '../add-article-dialog/add-type/add-type.component';
import { Color } from '@angular-material-components/color-picker';




@Component({
  template : ''
})
export class EditTypeEntryComponent {
  constructor(private route: ActivatedRoute,
    private dialog: MatDialog,
    protected router: Router) {
        this.openDialog();    
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(EditTypeComponent, 
      {
        width: '550px',
        height:  "500px",
        panelClass: 'edit_type_dialog',
        data: ""
    });
    dialogRef.afterClosed().subscribe(result => { 
      if (result !== undefined) {
        this.router.navigate(['../'], { relativeTo: this.route, state:{from: "edit_type", data: result} });
      }
      this.router.navigate(['../'], { relativeTo: this.route });
     });
  }
}

@Component({
  selector: 'app-edit-type',
  templateUrl: '../add-article-dialog/add-type/add-type.component.html',
  styleUrls: ['../add-article-dialog/add-type/add-type.component.css', './edit-type.component.css']
})

export class EditTypeComponent extends TypeBase implements OnInit {
  constructor(
    
    @Inject(MAT_DIALOG_DATA) public loaded_type: any,
    protected typeService: ListTypeGenService,
    protected formBuilder: FormBuilder,
    protected router: Router,
    public adialogRef: MatDialogRef<EditTypeComponent>,
    private route: ActivatedRoute,
    public dialogRef: MatDialog
    
    ) { 
    super(typeService, formBuilder, router, dialogRef)
    this.add = false;
    this.edit = true; 

    //On tente de recuperer l'id par l,url
    if (this.loaded_type.type !== undefined) { //SI on n'y arrive pas ALORS
      this.type.id = this.loaded_type.type;
      
    }
    else {
      this.type.id = parseInt(this.route.firstChild?.firstChild?.firstChild?.firstChild?.firstChild?.snapshot.paramMap.get("idType") || "") 
      console.log(this.route.firstChild?.firstChild?.firstChild?.firstChild?.firstChild?.snapshot);
    }
    
      //On recupere l'id a partir des datas du dialog
      
    this.typeService.getTypeById(this.type).subscribe(
      (res: any) => {
        
          if(
            res.status !== undefined && 
            res.status === "ok" && 
            res.type !== undefined 
          ) {
            this.type = new ListTypeGen(res.type);
            const temp = this.hexToRgb(this.type.color_to_hex);
            if (temp) {
              this.typeForm.patchValue({color: new Color(temp.r, temp.g, temp.b)});
            }
            this.typeForm.patchValue({
              type: "" +res.type.logo_patern,
              name: res.type.name
            })
            this.foo = this.type.color_to_hex;
          }
          else {
            this.router.navigate(["/"]);
          }
      },
      (err) => {
        console.log(err);
      }
    );
  
  }

  

  public close() {
    this.adialogRef.close();
  }

  public delete_type() {
    this.working = true;
    this.typeService.remove(this.type).subscribe(
      (res: any) => {
        console.log(res);
        this.adialogRef.close("delete"); 
      }
    );
  }

  onSubmit(event: Event) {
    event.preventDefault();
     
    if (this.typeForm.valid === true) { //SI le formulaire est valide ALORS
      this.working = true; //On disabled le bouton
      //On envoie le type
      this.type.name = this.typeForm.get('name')?.value;
      this.type.logo_patern = this.typeForm.get('type')?.value;
      this.type.color = this.typeForm.get('color')?.value;
      this.typeService.editType(this.type).subscribe(
        (res: any) => {
          if (res.status !== undefined && res.status === "ok") {
            this.adialogRef.close(this.type);
          }
        },
        (err: any) => {
          console.log(err.message); //On l'affiche
        }
      );

    }
  } 

  ngOnInit() {

  }
}

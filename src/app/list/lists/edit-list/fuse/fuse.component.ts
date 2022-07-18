import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ListCupboardService } from 'src/models/list-cupboard/list-cupboard.service';
import { List } from 'src/models/list/list';
import { ListService } from 'src/models/list/list.service';
import { CupboardLine } from 'src/models/list-cupboard/cupboard-line';
import { ListTypeGen } from 'src/models/list-type/list-type-gen';
import { ErrorDialogComponent } from 'src/app/error-dialog/error-dialog.component';

@Component({
  template: ""
})
export class FuseEntry {

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    protected router: Router,

    
  ) {  
    if(this.route.parent?.snapshot.params.id !== undefined) { 
    const dialogRef = this.dialog.open(FuseDialog, 
      {
        width: '900px',
        height: "800px",
        maxHeight: '90vh',
        panelClass: 'edit_type_dialog',
        data: this.route.parent?.snapshot.params.id
    });
    dialogRef.afterClosed().subscribe(result => { 
      if (result !== undefined) {
        this.router.navigate(['../'], { relativeTo: this.route, state:{from: "fuse", data: result} });
      }
      this.router.navigate(['../'], { relativeTo: this.route});
     });
  }
  else {
    this.router.navigate(['../'], { relativeTo: this.route});
  }}


}

@Component({
  selector: 'app-fuse',
  templateUrl: './fuse.component.html',
  styleUrls: ['./fuse.component.css']
})
export class FuseDialog implements OnInit {
  cupboardForm: FormGroup;
  loading = true;
  list = new List({
    id: -1,
    name: "",
    desc: "",
    date_create: new Date(),
    is_protected: false,
    is_archived: false,
    lines:[]
  });

  foo =true;
  cupboard: CupboardLine[] = [];
  cupboardToAdd: CupboardLine[] = [];

  private list_is_loaded: boolean = false;
  private cupboard_is_loaded: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public id: number,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialog,
    private theDialogRef: MatDialogRef<FuseDialog>,
    private listService: ListService,
    private cupboardService: ListCupboardService  
  ) { 
    this.cupboardForm = this.formBuilder.group({})
  }

  ngOnInit(): void {
    this.list.id = this.id;
    //On recupere les infos de la liste 
    this.listService.loadList(this.list).subscribe(
      (res: any) => {
        if(
          res.list.name !== undefined && typeof(res.list.name) === "string"
        ) {
          this.list.name = res.list.name; 
          this.list_is_loaded = true;
          if(this.list_is_loaded && this.cupboard_is_loaded) {
            this.loading = false;
          }
        }
      }
    );

    this.cupboardService.select_cupboard_for_fusion(this.list).subscribe(
      (res: any) => {
        if (res.cupboard instanceof Array) {
          for(let i = 0; i < res.cupboard.length; i++) {
            this.cupboard.push(new CupboardLine(res.cupboard[i]));
            this.cupboard[i].type = new ListTypeGen(res.cupboard[i].type);
            
          }
          this.cupboardForm.addControl('lines', this.formBuilder.array(this.cupboard.map(item=>{
            return this.createLine(item) 
           })),)
          this.cupboard_is_loaded = true;
          if(this.list_is_loaded && this.cupboard_is_loaded) {
            this.loading = false;
          }
        } 
      }
    )
  }

  getControls(): AbstractControl[] {
    return (this.cupboardForm.get('lines') as FormArray).controls;
  }
  
  OnCheckChange(i: number):void {
    if(this.cupboardForm.value["lines"][i]["is_checked"]) {
      ((this.cupboardForm.controls["lines"] as FormArray).controls[i] as FormGroup).controls["qte"].enable();
    }
    else {
      ((this.cupboardForm.controls["lines"] as FormArray).controls[i] as FormGroup).controls["qte"].disable();
    }
  }

  onSubmit(event: Event):void {
    this.cupboardToAdd = [];
    event.preventDefault();
    //this.loading = true; 
    if(this.cupboard_have_change()) { //SI il y a eu un changement ALORS 
      this.compil_cupboard_to_add();
      this.send_fuse()
     
    } 
    else {
      this.dialogRef.closeAll();
    }

  }


/*
  * FONCTION : 
  * Envoyer les articles du placard a fusionnes a l'API 
  */ 
 private send_fuse():void {
  this.cupboardService.fuse(this.list, this.cupboardToAdd).subscribe(
    (res: any) => {
      if(res.status !== undefined && res.status === "ok") {
        this.theDialogRef.close(this.cupboardToAdd);
      }
      else {
        const dialogRef = this.dialog.open(ErrorDialogComponent, 
          {
            width: '700px',
            height: "270px",
            maxHeight: '90vh',
            panelClass: 'error_dialog',
            data: res.error
            
        });
      }
    }
  )
 }

/*
  * FONCTION : 
  * Compiler les donnees a ajouter
  */ 
  private compil_cupboard_to_add():void {
    let to_add = this.cupboardForm.value["lines"];
    if(to_add.length === this.cupboard.length) {
      let j =0;
      for(let i = 0; i < this.cupboard.length; i++) {
        if(to_add[i].is_checked === true) {
          this.cupboardToAdd.push(this.cupboard[i]);
          this.cupboardToAdd[j].qte = to_add[i].qte;
          j++;
        }
        
      }
    }
  }


  /*
  * FONCTION : 
  * Savoir si il y a eu un changement dans le formulaire
  */ 
  private cupboard_have_change():boolean {
    let to_add = this.cupboardForm.value["lines"];
    if(to_add.length === this.cupboard.length) {
      for(let i = 0; i < this.cupboard.length; i++) {
        if(
          to_add[i].is_checked !== this.cupboard[i].is_checked
          ||
          ( to_add[i].qte !== undefined 
            &&
            to_add[i].qte !== this.cupboard[i].qte)
        ) {
          
          return true;
        }
      }
    }
    return false;
  }

  private createLine(cupboardLine: CupboardLine): FormGroup {
    
    return this.formBuilder.group({
      id: [cupboardLine.id],
      qte: [{value: cupboardLine.qte, disabled: !cupboardLine.is_checked}, Validators.compose([
        Validators.required,
        Validators.min(0)
        ])],
      label: [cupboardLine.label],
      color: [cupboardLine.type?.color_to_hex],
      patern: [cupboardLine.type?.logo_patern],
      unity: [cupboardLine.unity],
      is_checked: [cupboardLine.is_checked, Validators.required]
    });
  }
}

import { Overlay } from '@angular/cdk/overlay';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthListManager } from 'src/app/controlers/authListManager';
import { regEx } from 'src/app/controlers/regEx';
import { List } from 'src/models/list/list';
import { ListService } from 'src/models/list/list.service';
import { User, UserForAuthList } from 'src/models/user/user';

@Component({
  template: ''
})
export class EditAuthEntry  {
  
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    protected router: Router,
    private overlay: Overlay
  ) { 
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    if(this.route.parent?.snapshot.params.id !== undefined) { 
      const dialogRef = this.dialog.open(EditAuthDialog, 
        {
          width: '900px',
          height: "600px",
          maxHeight: '90vh',
          panelClass: 'edit_type_dialog',
          data: this.route.parent?.snapshot.params.id
      });
      dialogRef.afterClosed().subscribe(result => { 
        document.body.classList.remove("unscroll");
        if (result !== undefined) {
          //this.router.navigate(['../'], { relativeTo: this.route, state:{from: "add-list", data: result} });
        }
        this.router.navigate(['../'], { relativeTo: this.route});
       });
    }
    else {
      this.router.navigate(['../'], { relativeTo: this.route});
    }
    
  
  }

}

@Component({
  selector: 'app-edit-auth',
  templateUrl: './edit-auth.component.html',
  styleUrls: ['./edit-auth.component.css']
})
export class EditAuthDialog implements OnInit {
  list: List = new List({
    id: -1,
    name: "",
    desc: "",
    date_create: new Date(),
    is_protected: false,
    is_archived: false,
    lines:[]
  });
  listAuthForm: FormGroup;
  working = false;
  loading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public id: number,
    protected formBuilder: FormBuilder,
    public dialogRef: MatDialog,
    private listService: ListService
  ) { 

    this.listAuthForm = this.formBuilder.group({ //On crée le formulaire
      auth_needed: [false, Validators.required],
      auth_list: ["", Validators.pattern(regEx.AUTH_FOR_LIST_PATERN)]
    });
  }

  ngOnInit(): void {
    this.list.id = this.id; 

    //On regarde si la liste est public ou privee 
    this.listService.loadList(this.list).subscribe(
      (res: any) => {
        if(res.list.is_protected !== undefined && typeof(res.list.is_protected) === "boolean") {
          this.listAuthForm.patchValue({auth_needed: res.list.is_protected});
          this.list = new List(res.list);
          this.loading = false;
        }
      }
    )
  }

  reset_auth_list() {
    this.list.user_auth = [];
    this.listAuthForm.patchValue({auth_list: ""});
  }

  onAuthChange(auth: UserForAuthList[]) {
    
    let lm = new AuthListManager();
    let lmr = lm.onAuthChange(auth);
    this.list.user_auth = lmr.user;
    this.listAuthForm.patchValue({auth_list: lmr.auth_list});
    
  }

  onSubmit(event: Event) {

    event.preventDefault();
    this.loading = true;
    this.list.is_protected = this.listAuthForm.value["auth_needed"];
    
    if(this.list.is_protected === true) {

      this.listService.modifyAuth(this.list).subscribe(
        (res: any) => {
          if(res.status !== undefined && res.status === "ok") {
            this.dialogRef.closeAll();
          } 
        }
      )
    }
    else {
      this.listService.toPublic(this.list).subscribe(
        (res: any) => {
          if(res.status !== undefined && res.status === "ok") {
            this.dialogRef.closeAll();
          } 
        }
      )
    }
    
  }
}

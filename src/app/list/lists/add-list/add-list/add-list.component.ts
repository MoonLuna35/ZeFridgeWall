import { Component, OnInit, ValueProvider } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EditTypeComponent } from 'src/app/list/edit-type/edit-type.component';
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { User, UserForAuthList } from 'src/models/user/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { List } from 'src/models/list/list';
import { ListService } from 'src/models/list/list.service';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Overlay } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import { AuthListManager } from 'src/app/controlers/authListManager';
import { regEx } from 'src/app/controlers/regEx';

@Component({
  template: ''
})
export class AddListEntryComponent  {
  
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    protected router: Router,
    private overlay: Overlay
  ) { 
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    const dialogRef = this.dialog.open(AddListDialog, 
    {
      width: '900px',
      height: "900px",
      maxHeight: '90vh',
      panelClass: 'edit_type_dialog',
      data: ""
  });
  document.body.classList.add("unscroll");
  dialogRef.afterClosed().subscribe(result => { 
    document.body.classList.remove("unscroll");
    if (result !== undefined) {
      this.router.navigate(['../'], { relativeTo: this.route, state:{from: "add-list", data: result} });
    }
    this.router.navigate(['../'], { relativeTo: this.route, state:{from: "add-list"} });
   });
  }

}


@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.css']
})
export class AddListDialog implements OnInit  {
  auth_is_needed = true;
  newListForm: FormGroup;
  working = false;

  
  protected list: List = new List({
    id: -1,
    name: "", 
    desc: "", 
    date_create: new Date(), 
    is_protected: false,
    is_archived: false, 
    lines: []
  })

  constructor(
    protected formBuilder: FormBuilder,
    protected listService: ListService,
    public theDialogRef: MatDialogRef<AddListDialog>,
    private translate: TranslateService
  ) {
    
    this.newListForm = this.formBuilder.group({ //On crée le formulaire
      
      name: ["", 
        Validators.compose([Validators.required, Validators.pattern(regEx.ALPHANUM_PATERN)])],
      desc: [""],
      auth_needed: [false, Validators.required],
      auth_list: ["", Validators.pattern(regEx.AUTH_FOR_LIST_PATERN)]
    });

    this.translate.stream('list.The_list_of').subscribe(
      (res: any) => {
        this.newListForm.patchValue({name: res + new Date().toLocaleDateString()}); 
      }
    );
  }

  ngOnInit() {

  }

  reset_auth_list() {
    this.list.user_auth = [];
    this.newListForm.patchValue({auth_list: ""});
  }

  onAuthChange(auth: UserForAuthList[]): void  {
    let lm = new AuthListManager();
    let lmr = lm.onAuthChange(auth);
    this.list.user_auth = lmr.user;
    this.newListForm.patchValue({auth_list: lmr.auth_list});
  }

  private add_list() {
    this.listService.addList(this.list).subscribe(
      (res: any) => {
        if(res.list !== undefined) {
          let added_list: List = res.list;
          this.theDialogRef.close(added_list);
        }
      }
    )
  }

  public onSubmit(event: Event) { 
    event.preventDefault();
    if (this.newListForm.valid === true) {
      this.working = true;
      //on creer les utiliateur qui pourront utlisiser la liste

      this.list.name = this.newListForm.value["name"];
      this.list.desc = this.newListForm.value["desc"];
      this.list.is_protected = this.newListForm.value["auth_needed"];

      this.add_list();

    }

  }
}
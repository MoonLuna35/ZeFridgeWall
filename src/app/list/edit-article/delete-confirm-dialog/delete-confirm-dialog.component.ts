import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.css']
})
export class DeleteConfirmDialogComponent implements OnInit {
  article_is_in_cupboard = false;
  label = "";
  constructor(@Inject(MAT_DIALOG_DATA) public res: any,) {
    this.label = this.res.article.label;
    console.log(this.res);
    if (this.res.res.status) {
      for(let i = 0; i < this.res.res.status.length; i++) {
        if (this.res.res.status[i] === "product in cupboard") {
          this.article_is_in_cupboard = true;
        }
      }
    }
    
  }

  ngOnInit(): void {
   
  }

}

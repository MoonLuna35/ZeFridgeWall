import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent implements OnInit {
  loading:boolean = true;
  message_text:string = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public msg: string,
    public dialogRef: MatDialog,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.stream('error.' + this.msg).subscribe(
      (res: any) => {
        this.message_text = res;
        this.loading = false; 
      }
    );
    setTimeout(()=>{
      this.dialogRef.closeAll();
  }, 3000)
  }

  
}

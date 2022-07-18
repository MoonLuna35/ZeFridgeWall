import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from 'src/models/user/user.service';

@Component({
  template: ""
})
export class LogOutEntry implements OnInit {

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    const dialogRef = this.dialog.open(LogOutDialog, 
      {
        width: '700px',
        height: "270px",
        maxHeight: '90vh',
        panelClass: 'error_dialog'
        
    });
  }

}

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.css']
})
export class LogOutDialog implements OnInit {

  constructor(
    private userService: UserService,
    protected router: Router,  
    public dialogRef: MatDialog,
  ) { }

  ngOnInit(): void {
    //On suprime l'utilisateur
    this.userService.log_out().subscribe(
      () => {
        localStorage.removeItem("user");
        this.dialogRef.closeAll();
        this.router.navigate(['/welcome']);
        
      }
    );//On revoque les tokens de rafraichissements
  }

}

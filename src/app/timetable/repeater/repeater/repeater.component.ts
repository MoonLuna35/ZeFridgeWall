import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  template: ""
})
export class RepeaterEntryComponent {

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    protected router: Router,
  ) {
    
    const dialogRef = this.dialog.open(RepeaterComponent, 
    {
      width: '900px',
      height: "900px",
      maxHeight: '90vh',
      panelClass: 'edit_type_dialog',
      data: ""
  });
  dialogRef.afterClosed().subscribe(result => { 
    if (result !== undefined) {
      this.router.navigate(['../'], { relativeTo: this.route} );
    }
    this.router.navigate(['../'], { relativeTo: this.route });
   });
  }

}

@Component({
  selector: 'app-repeater',
  templateUrl: './repeater.component.html',
  styleUrls: ['./repeater.component.scss']
})
export class RepeaterComponent implements OnInit {
  @Input() repeater_weekly: FormGroup;
  constructor() { 
    
  }

  ngOnInit(): void {
  }

}

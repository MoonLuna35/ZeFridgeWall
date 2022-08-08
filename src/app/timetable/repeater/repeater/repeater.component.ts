import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, MinValidator, Validators } from '@angular/forms';
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
export class RepeaterComponent implements AfterContentInit, OnInit {
  @Input() event: FormGroup;

  

  repeater = this.formBuilder.group({ //le formulaire pour la repetion
    repeat_patern: ['weekly']
    
  });

  


  constructor(protected formBuilder: FormBuilder) { 
   
    
  }
  

  ngAfterContentInit(): void {
    this.repeater.get("repeat_patern")?.valueChanges.subscribe(newValue => {
    });
    
    
  }

  ngOnInit(): void {
    this.event.addControl("repeater", this.repeater);
    
  }

}

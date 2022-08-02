import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, MinValidator, Validators } from '@angular/forms';
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
  @Input() repeater: FormGroup;

  private repeater_weekly = this.formBuilder.group({
    n_week:[1, Validators.min(1)],
    repeat_monday: [false],
    repeat_tuesday: [false],
    repeat_wednesday: [false],
    repeat_thursday: [false],
    repeat_friday: [false],
    repeat_saturday: [false],
    repeat_sunday: [false]
  });

  private repeater_daily = this.formBuilder.group({
    n_day:[1, Validators.min(1)]
  });

  constructor(protected formBuilder: FormBuilder) { 
    
  }

  ngAfterContentInit(): void {
    this.repeater.addControl('repeat_body', this.repeater_weekly);
    this.repeater.get("repeat_patern")?.valueChanges.subscribe(newValue => {
      this.check_patern(newValue);
    });

    
  }

  ngOnInit(): void {
    this.repeater.addControl('repeat_body', this.repeater_weekly);
    
  }

  private check_patern(v: string): void {
    switch(v) {
      case "weekly" : {
        this.repeater.setControl('repeat_body', this.repeater_weekly);
      }break; 
      case "daily" : {
        this.repeater.setControl('repeat_body', this.repeater_daily );
      }break;
    }
  }

}

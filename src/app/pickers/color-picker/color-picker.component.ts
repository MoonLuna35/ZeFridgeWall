import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit, OnChanges {
  @Input() heading: string = "";
  @Input() color: string = "rgb(0, 255, 0)";
  @Output() event: EventEmitter<string> = new EventEmitter<string>();

  

  public show = false;
  public defaultColors: string[][] = [
    //rouge
    [
      '#cc0011', //red
      '#99000c', //red
      '#661b21', //red
    ],
    //pink
    [
      '#cc36bc', //pink
      '#99288d', //pink
      '#661b5e', //pink
    ],
    //violet
    [
      '#6300cc',
      '#4a0099', 
      '#310066', 
    ],
    
    
    //dark blue
    [
      '#354acc', //dark blue
      '#283799', //dark blue
      '#1b2566', //dark blue
    ],

    //blue
    [
      '#82ccb9', //blue
      '#62998b', //blue
      '#3e6158', //blue
    ],
  
    //green
    [
      '#5dc740', 
      '#489931', 
      '#306621', 
    ],

    //yelow
    [ 
      '#bccc35',  
      '#8d9928', 
      '#5e661b',  
    ],
     //yelow
    [ 
      '#cc9646',  
      '#997034', 
      '#664b23',  
    ],
     //black
     [ 
      '#999999',  
      '#666666', 
      '#000000' 
    ]
  ];
  
  @ViewChild('colorPicker') colorPicker?: ElementRef;
  @ViewChild('toogleColor') toogleColor?: ElementRef;

  constructor(
    private renderer: Renderer2

  ) {
    this.renderer.listen('window', 'click',(e:Event)=>{
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
     if(e.target!==this.colorPicker?.nativeElement && e.target!==this.toogleColor?.nativeElement){
        this.show = false;
     }
 });

  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    this.changeColor(changes.color.currentValue);
  }

  /**
   * Change color from default colors
   * @param {string} color
   */
  public changeColor(color: string): void {
    this.color = color;
    this.event.emit(this.color);
    this.show = false;
  }

  

  /**
   * Change status of visibility to color picker
   */
  public toggleColors(): void {
    this.show = !this.show;
  }

  ngOnInit() {
    this.changeColor(this.defaultColors[6][2])
  }
}

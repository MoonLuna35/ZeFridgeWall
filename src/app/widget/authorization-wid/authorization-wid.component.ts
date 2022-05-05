import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { ListService } from 'src/models/list/list.service';
import { UserForAuthList } from 'src/models/user/user';
import { Output, EventEmitter } from '@angular/core';
import { List } from 'src/models/list/list';

@Component({
  selector: 'app-authorization-wid',
  templateUrl: './authorization-wid.component.html',
  styleUrls: ['./authorization-wid.component.css']
})
export class AuthorizationWidComponent implements OnInit, AfterViewInit {
  @Input() edit_mod = false;
  @Input() list = new List({
    id: -1,
    name: "",
    desc: "",
    date_create: new Date(),
    is_protected: false,
    is_archived: false,
    lines:[]
  });
  
  @Output() userLists = new EventEmitter<UserForAuthList[]>();

  loading = true;
  not_moves:UserForAuthList[] = [];
  auths: UserForAuthList[] = [];
  not_auths: UserForAuthList[] = [];
  auth_is_needed = true;

  

  pos_not_auth: number[] = [];
  pos_auth: number[] = [];



  @ViewChild('auth_box') auth_box: ElementRef | undefined;
  @ViewChild('not_auth_box') not_auth_box: ElementRef | undefined;

  @HostListener('window:resize', ['$event'])
    onResize() {
    this.calculate_pos();
  }
  constructor(private listService: ListService) {
    
    
    
  }
  ngOnInit(): void {
    if(!this.edit_mod) {
      this.get_house_add_mod();
    }
    
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.list.is_protected === false) {
      this.get_house_add_mod();
    }
    else{ 
      this.get_house_edit_mod();
    } 
   
 }
  
  private get_house_add_mod(): void {
    this.listService.selectHouse().subscribe(
      (res: any) => {
        if(res.users.length !== undefined && res.users.length > 0) {
          for(let i = 0; i < res.users.length; i++) {
            if (res.users[i].is_grey === true) {
              this.not_moves.push(new UserForAuthList(res.users[i]));
            }
            else {
              this.auths.push(new UserForAuthList(res.users[i]));
            }
          }
          this.userLists.emit(this.auths)//On renvoie les listes au parent
        }
        this.loading = false;
      }
    )
  }

  private get_house_edit_mod(): void {
    this.listService.selectHouseEditMod(this.list).subscribe(
      (res: any) => {
        if(res.users.length !== undefined && res.users.length > 0) {
          for(let i = 0; i < res.users.length; i++) {
            if (res.users[i].is_grey === true) {
              this.not_moves.push(new UserForAuthList(res.users[i]));
            }
            else if(res.users[i].is_checked === true) {
              this.auths.push(new UserForAuthList(res.users[i]));
            }
            else {
              this.not_auths.push(new UserForAuthList(res.users[i]));
            }
          }
          this.userLists.emit(this.auths)//On renvoie les listes au parent
        }
        this.loading = false;
      }
    )

  }

  calculate_pos() {
    let rect_not_auth = this.not_auth_box?.nativeElement.getBoundingClientRect();
    let rect_auth = this.auth_box?.nativeElement.getBoundingClientRect();

    this.pos_auth = [rect_auth.top, rect_auth.bottom, rect_auth.left, rect_auth.right];
    this.pos_not_auth = [rect_not_auth.top, rect_not_auth.bottom, rect_not_auth.left, rect_not_auth.right];
    
    
  }

  ngAfterViewInit() {
    //On attends que le dialogue soit ouvrert 
    setTimeout(() =>{ //UNE FOIS qu'il a fini de s'ouvrir FAIRE
      this.calculate_pos() //On calcul les position des box
    }, 1000);
  }

  moveElement(event :any, from: string, indice: number) {
    
    var rect =(event.target as HTMLSpanElement).getBoundingClientRect();
    var posX = rect.left; 
    var posY = rect.top;
    

    (event.target as HTMLSpanElement).className = "list_auth_wid absolute";
    (event.target as HTMLSpanElement).style["top"]=posY+ "px";
      (event.target as HTMLSpanElement).style["left"]=posX + "px";
    document.body.onmousemove = mousePos => {
      (event.target as HTMLSpanElement).style["top"]=mousePos.clientY-20 + "px";
      (event.target as HTMLSpanElement).style["left"]=mousePos.clientX-20 + "px";
      
    }
    document.body.onmouseup = mouse_up => { //QUAND l'utilisateur relache la souris ALORS
      if(from === "not_auth") {//On regarde si on est dans le bloc oppose
        if(
          mouse_up.clientX > this.pos_auth[2] && mouse_up.clientX < this.pos_auth[3]
          &&
          mouse_up.clientY > this.pos_auth[0] && mouse_up.clientY < this.pos_auth[1]
        ) { //SI on y est ALORS
          if(this.not_auths[indice] !== undefined) {
            this.auths.push(this.not_auths[indice]);//On ajoute l'element dans la liste oppose
            this.not_auths.splice(indice, 1);//On supprime l'element la liste courrante
            this.userLists.emit(this.auths)//On renvoie les listes au parent
          }
          
        }
      }
      if(from === "auth") {//On regarde si on est dans le bloc oppose
        if(
          mouse_up.clientX > this.pos_not_auth[2] && mouse_up.clientX < this.pos_not_auth[3]
          &&
          mouse_up.clientY > this.pos_not_auth[0] && mouse_up.clientY < this.pos_not_auth[1]
        ) { //SI on y est ALORS
          if(this.auths[indice] !== undefined) {
            this.not_auths.push(this.auths[indice]);//On ajoute l'element dans la liste oppose
            this.auths.splice(indice, 1);//On supprime l'element la liste courrante
            this.userLists.emit(this.auths)//On renvoie les listes au parent
          }
          
        }
       
      }
        //On remet l'element en position initiale
        (event.target as HTMLSpanElement).className = "list_auth_wid";
        (event.target as HTMLSpanElement).style["top"]=posY + "px";
        (event.target as HTMLSpanElement).style["left"]=posX + "px";
        from = "";
        document.body.onmousemove = null; //On ne modifie plus la position du nom 
    }
  }
}

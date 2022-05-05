import { trigger } from '@angular/animations';
import { ThrowStmt } from '@angular/compiler';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListArticle } from 'src/models/list-article/list-article';
import { ListTypeGen } from 'src/models/list-type/list-type-gen';
import { List } from 'src/models/list/list';
import { ListLine } from 'src/models/list/list-line';
import { ListService } from 'src/models/list/list.service';
import { User } from 'src/models/user/user';

@Injectable()
export class ListBaseComponent implements OnInit {
  list: List = new List({
    id: -1,
    name: "",
    desc: "",
    date_create: new Date(),
    is_protected: false,
    is_archived: false,
    lines: [], 
    
  });
  have_fused_article = false;

  archiver_working = false;
  in_edit = -1;
  rooted = false;
  is_edit_mod = false;
  protected ALPHANUM_PATERN = "^[a-zA-Z0-9-_ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØŒŠþÙÚÛÜÝŸàáâãäåæçèéêëìíîïðñòóôõöøœšÞùúûüýÿ/ ]+$" //La regex pour prende que les caracteres alphanumeriques
  listForm: FormGroup; //Le formulaire
  constructor(
    protected route: ActivatedRoute,
    protected listService: ListService,
    protected router: Router,
    protected formBuilder: FormBuilder,
  ) { 
    this.list.id =  parseInt(this.route.snapshot.paramMap.get("id") || "-1"); //on recupere l'id

    this.listForm = this.formBuilder.group({
        label: ["", 
          Validators.compose([
            Validators.required,
            Validators.pattern(this.ALPHANUM_PATERN)
          ])
        ],
        desc: [""]
    });
  }

  createLine(item: any): FormGroup {
    
    return this.formBuilder.group({
      qte: [item.qte],
      id: [item.id],
      name: [item.label],
      patern: [item.type.logo_patern],
      color: [item.type.color_to_hex],
      unity: [item.unity],
      used: [false],
      is_from_cupboard: [item.is_from_cupboard]
    });
  }

  loadList():void {
    this.listService.loadList(this.list).subscribe(
      (res: any) => {
        if(
          res.list !== undefined
        ) {
          this.list = new List(res.list);
          this.list.author = new User(res.list.author);
          this.list.date_create = new Date(this.list.date_create);
          for(let i = 0; i < this.list.lines.length; i++) {
            this.list.lines[i].type = new ListTypeGen(res.list.lines[i].type);
            if(this.list.lines[i].qte === -1) {
              this.list.lines[i].qte = 0;
            }
            if(this.list.lines[i].is_from_cupboard === true) {
              this.have_fused_article = true;
            }
            
          }
          
          //SI il est root ou l'auteur ALORS
        //il est autoriser a gerer les authorisatio
          const str_user = localStorage.getItem("user");
          if (str_user) {
          const user: User = new User(JSON.parse(str_user)); 
            if(
              user.id 
              && 
              user.id === this.list.author.id
              ||
              user.is_root 
              &&
              user.is_root === true
            ) {
              this.rooted = true
            }
          }
        }

        this.listForm.patchValue({
          label: this.list.name,
          desc: this.list.desc
        });
        this.listForm.addControl('lines', this.formBuilder.array(this.list.lines.map(item=>{
          return this.createLine(item) 
         })),)
    
      },
      (err) => {
        if(err.status === 404) {

        }
        console.log(err.status);
      }
    )
  }

  ngOnInit(): void {
    this.loadList();
    //On cherche a savoir si l'utilisateur a le droit de modifier les acces
      
  }

  edit():void  {
    this.is_edit_mod = !this.is_edit_mod;
    
  }

  delete_list() :void {
    this.listService.askDeleteToken(this.list).subscribe(
      (res: any) => {
        if(res.token !== undefined && typeof(res.token) === "string") {
          console.log("delete confirm dialog will open");
          console.log(res);
        }
        else {
          console.log(res); 
        }
      },
      (err) => {
        console.log(err);
      }
    )
  }
  /**
   * DANS CETTE FONCTION : 
   * On archive la liste si elle est pas deja archivee
   * 
   *  */ 
  archive(): void {
    this.archiver_working = true;
    this.listService.archive(this.list).subscribe(
      (res: any) => {
        if(res.error === undefined) {
          this.list.is_archived = true;
          
        }
        else {
          console.log(res);
        }
        this.archiver_working = false;
      },
      (err: any) => {
        console.log(err);
        this.archiver_working = false;
      }
    )
  }
  /**
   * DANS CETTE FONCTION : 
   * On desarchive la liste si elle ne l'est pas
   * 
   *  */ 
  unarchive(): void {
    this.archiver_working = true;
    this.listService.unarchive(this.list).subscribe(
      (res: any) => {
        
        if(res.error === undefined) {
          this.list.is_archived = false;
        }
        else {
          console.log(res);
        }
        this.archiver_working = false;
      },
      (err: any) => {
        console.log(err);
        this.archiver_working = false;
      }
    )
  }

 
}


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent extends ListBaseComponent {
  constructor(
    protected route: ActivatedRoute,
    protected listService: ListService,
    protected router: Router,
    protected formBuilder: FormBuilder,
    
    ) {
        super(route, listService, router, formBuilder);
    }
} 

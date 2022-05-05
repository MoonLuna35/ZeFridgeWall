import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ListArticle } from 'src/models/list-article/list-article';
import { ListArticleService } from 'src/models/list-article/list-article.service';
import { ListLine } from 'src/models/list/list-line';
import { ListTypeGen } from 'src/models/list-type/list-type-gen';


export function forbiddenNameValidator(list: ListLine[]|ListArticle[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let forbidden = false;
    if(list !== undefined)
    for(let i=0; i < list.length; i++) {
      
      if(list[i].label === control.value) {
        forbidden = true;
      }
    }
    
    return forbidden ? {forbiddenName: {value: control.value}} : null;
  };
}

@Component({
  selector: 'app-add-article-wid',
  templateUrl: './add-article-wid.component.html',
  styleUrls: ['./add-article-wid.component.css']
})
export class AddArticleWidComponent implements OnInit, OnChanges {
  @Output() article = new EventEmitter<ListArticle>();
  @Output() msg = new EventEmitter<string>();
  @Input() error = false;
  @Input() clear_article = false;
  @Input() list:ListLine[] = [];

  added_article = new ListArticle ({id:-1, label: "", type: new ListTypeGen({}), user:1, unity:""});
  result: any[]=[];
  bp_disabled = false;
  articleForm: FormGroup; 
  protected ALPHANUM_PATERN = "^[a-zA-Z0-9-_ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØŒŠþÙÚÛÜÝŸàáâãäåæçèéêëìíîïðñòóôõöøœšÞùúûüýÿ\' ]+$"
  constructor(
    private articleService: ListArticleService,
    protected formBuilder: FormBuilder,
  ) {
    this.articleForm = this.formBuilder.group({ //On crée le formulaire
      name: ["", [Validators.required, Validators.pattern(this.ALPHANUM_PATERN), forbiddenNameValidator(this.list)] ]
    });
   }


   ngOnChanges(changes: SimpleChanges) {
     if(this.clear_article !== undefined && this.clear_article === true) {
      this.articleForm.patchValue({name: ""});
      setTimeout(()=>this.msg.emit("article cleared"));
     }
    
    this.articleForm = this.formBuilder.group({ //On crée le formulaire
      name: ["", [Validators.required, Validators.pattern(this.ALPHANUM_PATERN), forbiddenNameValidator(this.list)] ]
    });
    
  }
  
  ngOnInit(): void {
    
    
  }

  autocomplete() {
    
    if(this.articleForm.value['name']) {
      this.articleService.searchArticle(this.articleForm.value['name']).subscribe(
        (res: any) => {
          if(res.products !== undefined) {
            //On elimine l'element de l'auto complete si il est dans la liste
            for(let i=0; i < res.products.length; i++) {
              for(let j=0; j < this.list.length; j++) {
                if (res.products[i].label === this.list[j].label) {
                  res.products.splice(i, 1);
                  if(res.products.length === 0) {
                    j = this.list.length;
                  }
                }
              }
            }
            this.result = res.products;
          }
          else {
            this.result = [];
          }
          
        }
      );
    }
    else {
      this.result = [];
    }
    
  }

  modify_add(label: string) {
    this.added_article.label = label; 
    this.articleForm.patchValue({name: label});
    this.result = [];
  }
   /*
  *
  * QUAND l'utilisateur envoie le formulaire
  * 
  * */
   public onSubmit(event: Event) {
    event.preventDefault();
    this.added_article.label = this.articleForm.value['name'];
    
    this.article.emit(this.added_article);
  
  }
}

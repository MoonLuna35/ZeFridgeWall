import { Component, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-add-article-dialog',
  templateUrl: './add-article-dialog.component.html',
  styleUrls: ['./add-article-dialog.component.css']
})
export class AddArticleDialog {
  contentTemplate!: TemplateRef<any>;
}
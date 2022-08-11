import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,  ReactiveFormsModule} from '@angular/forms';


import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';

import {MatDialogModule} from '@angular/material/dialog';
import{ MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule }from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
 
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { ActivatedRoute } from '@angular/router';


import { RouterModule, Routes } from '@angular/router';
import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ListComponent } from './list/lists/list/list.component';
import { FridgeDoorComponent } from './fridge-door/fridge-door.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { CheckCupboardComponent } from './list/check-cupboard/check-cupboard.component';
import { AddArticleDialog } from './list/add-article-dialog/add-article-dialog.component';
import { ColorPickerComponent } from './pickers/color-picker/color-picker.component'

import { RouterOutlet } from '@angular/router';



import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AuthInterceptor } from './auth.interceptor';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ActivateAcountComponent } from './sign-in/activate-acount/activate-acount.component';
import { LogInComponent } from './log-in/log-in.component';
import { NewDeviceComponent } from './log-in/new-device/new-device.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './guard/auth.guard';
import { AddTypeComponent } from './list/add-article-dialog/add-type/add-type.component';
import { AddTypeForEditComponent }from './list/add-article-dialog/add-type/add-type.component';
import { AddArticleComponent } from './list/add-article-dialog/add-article/add-article.component';

import { AdddArticleDialogWrapperComponent } from './list/add-article-dialog/add-article-dialog-wrapper.component';
import { EditTypeEntryComponent, EditTypeComponent } from './list/edit-type/edit-type.component';
import { EditArticleComponent } from './list/edit-article/edit-article.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { DeleteConfirmDialogComponent } from './list/edit-article/delete-confirm-dialog/delete-confirm-dialog.component';
import { ListsComponent } from './list/lists/lists.component';
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { MatTree, MatTreeModule } from '@angular/material/tree';


import { AddListDialog, AddListEntryComponent } from './list/lists/add-list/add-list/add-list.component';
import { AuthorizationWidComponent } from './widget/authorization-wid/authorization-wid.component';
import { ListNavComponent } from './list/list-nav/list-nav.component';
import { AddArticleWidComponent } from './widget/add-article-wid/add-article-wid.component';
import { EditListComponent } from './list/lists/edit-list/edit-list.component';

import { ConfirmDeleteEntry, ConfirmDeleteDialog } from './list/lists/confirm-delete/confirm-delete.component';
import { EditAuthEntry, EditAuthDialog } from './list/lists/edit-auth/edit-auth.component';
import { FuseEntry, FuseDialog } from './list/lists/edit-list/fuse/fuse.component';

import { ErrorDialogComponent } from './error-dialog/error-dialog.component';

import { LogOutDialog, LogOutEntry } from './users/log-out/log-out.component';

import { DateService, TimeTableComponent } from './timetable/time-table/time-table.component';
import { NewEventComponent } from './timetable/event-form/new-event.component';
import { NewEventData } from './timetable/event-form/new-event.component';
import { RepeaterComponent, RepeaterEntryComponent } from './timetable/repeater/repeater/repeater.component';
import { EventMessageComponent } from './timetable/event-form/message/event-message.component';
import { EachWeekComponent } from './timetable/repeater/each_week/each-week/each-week.component';
import { DailyComponent } from './timetable/repeater/daily/daily.component';
import { MonthlyComponent } from './timetable/repeater/monthly/monthly.component';
import { YearlyComponent } from './timetable/repeater/yearly/yearly.component';
import { EventComponent } from './timetable/event-form/event/event.component';
import { TaskComponent } from './timetable/event-form/task/task.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    CheckCupboardComponent,
    FridgeDoorComponent,
    SignInComponent,
    ActivateAcountComponent,
    LogInComponent,
    NewDeviceComponent,
    WelcomeComponent,
    ColorPickerComponent,
    
    AddArticleDialog,
    AdddArticleDialogWrapperComponent,
    AddTypeComponent,
    AddTypeForEditComponent,
    AddArticleComponent,
    EditTypeComponent,
    EditTypeEntryComponent,
    EditArticleComponent,
    MessageDialogComponent,
    DeleteConfirmDialogComponent,
    ListsComponent,
    
    AddListDialog,
    AddListEntryComponent,
    AuthorizationWidComponent,
    ListNavComponent,
    AddArticleWidComponent,
    EditListComponent,
    
    ConfirmDeleteEntry,
    ConfirmDeleteDialog,
    
    EditAuthEntry,
    EditAuthDialog,
    FuseEntry,
    FuseDialog,
    
    ErrorDialogComponent,
    
    LogOutEntry,
    LogOutDialog,
    
    TimeTableComponent,
    NewEventComponent,
    
    RepeaterComponent,
    RepeaterEntryComponent,
    EventMessageComponent,
    EachWeekComponent,
    DailyComponent,
    MonthlyComponent,
    YearlyComponent,
    EventComponent,
    TaskComponent
    


  ],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatIconModule,
    MatTreeModule,
    MatFormFieldModule,
    MatCheckboxModule,
    NgxMatColorPickerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (httpTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS},
      {provide: MAT_DATE_LOCALE, useValue: 'fr'},
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      AuthGuard,
      NewEventData,
      DatePipe,
      DateService,
  ],
  bootstrap: [AppComponent]
})


export class AppModule { }


export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
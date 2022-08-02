import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

import { FridgeDoorComponent } from './fridge-door/fridge-door.component';
import { RootGuard } from './guard/root.guard';
import { WelcomeComponent } from './welcome/welcome.component';


//inscription
import { ActivateAcountComponent } from './sign-in/activate-acount/activate-acount.component';
import { NewDeviceComponent } from './log-in/new-device/new-device.component';
import { SignInComponent } from './sign-in/sign-in.component';

//connexion
import { LogInComponent } from './log-in/log-in.component';
import { LogOutEntry } from './users/log-out/log-out.component';

//listes
import { AddListEntryComponent } from './list/lists/add-list/add-list/add-list.component';
import { AdddArticleDialogWrapperComponent } from './list/add-article-dialog/add-article-dialog-wrapper.component';
import { AddArticleComponent } from './list/add-article-dialog/add-article/add-article.component';
import { AddTypeComponent } from './list/add-article-dialog/add-type/add-type.component';
import { CheckCupboardComponent } from './list/check-cupboard/check-cupboard.component';
import { ConfirmDeleteEntry } from './list/lists/confirm-delete/confirm-delete.component';
import { DeleteConfirmDialogComponent } from './list/edit-article/delete-confirm-dialog/delete-confirm-dialog.component';
import { EditArticleEntryComponent } from './list/edit-article/edit-article.component';
import { EditAuthEntry } from './list/lists/edit-auth/edit-auth.component';
import { EditListComponent } from './list/lists/edit-list/edit-list.component';
import { EditTypeEntryComponent } from './list/edit-type/edit-type.component';
import { FuseEntry } from './list/lists/edit-list/fuse/fuse.component';
import { ListComponent } from './list/lists/list/list.component';
import { ListsComponent } from './list/lists/lists.component';
import { ListNavComponent } from './list/list-nav/list-nav.component';
import { TimeTableComponent } from './timetable/time-table/time-table.component';
import { NewEventComponent, NewEventEntryComponent } from './timetable/evt/new-event/new-event.component';
import { RepeaterEntryComponent } from './timetable/repeater/repeater/repeater.component';


const routes: Routes = [
  { path: 'log-out', component: LogOutEntry, canActivate : [AuthGuard]},
  { path: 'door', component: FridgeDoorComponent, data: {animation: 'door' }, canActivate : [AuthGuard]},
  { path: 'welcome', component: WelcomeComponent, data: {animation: 'welcome'}},
  { path: 'sign_in_valid', component: ListComponent, data: {animation: 'sign_in_valid'}},
  { path: 'activate-account/:token', component: ActivateAcountComponent, data: {animation: 'activate-account'}},
  { path: 'sign-in/:step', component: SignInComponent,  data: {animation: 'SignIn'}},
  { path: 'sign-in/*', redirectTo: '/sign-in/infos'},
  { path: 'sign-in', redirectTo: '/sign-in/infos',pathMatch: 'full'},
  { path: 'log-in', component: LogInComponent,  data: {animation: 'LogIn'} },
  { path: 'new-device/:token', component: NewDeviceComponent, data: {animation: 'new-device'}},
  { path: 'lists', component: ListNavComponent, data: {animation: 'Lists'}, canActivate : [AuthGuard],
    children: [ 
      { path: '', redirectTo: '/lists/lists', pathMatch: 'full'},
      { path: 'lists', component: ListsComponent, data: {animation: 'Lists'}, canActivate : [AuthGuard],
        children: [
          {path: 'new-list', component: AddListEntryComponent, canActivate : [AuthGuard]}
        ]},
        { path: 'list/:id', component: ListComponent, data: {animation: 'list-i'}, canActivate : [AuthGuard],
          children: [
            {
              path: "delete",
              component: ConfirmDeleteEntry
            }, 
            {
              path: "edit-auth",
              component: EditAuthEntry
            }, 
          ]
        },
        { path: 'edit-list/:id', component: EditListComponent, data: {animation: 'list-i'}, canActivate : [AuthGuard, RootGuard],
        children: [
          {
            path: 'add',
            component: AdddArticleDialogWrapperComponent, 
            children: [
              {
                path: "article",
                component: AddArticleComponent,
                children: [
                  {
                    path: "edit-type/:idType",
                    component: EditTypeEntryComponent
                    
                  }
                ]
              },
              {
                  path: "type",
                  component: AddTypeComponent
              },
              {
                path: '**',
                redirectTo: 'article'
              }
            ]
          },
          {
            path: "delete",
            component: ConfirmDeleteEntry
          },
          {
            path: "edit-article/:id",
            component: EditArticleEntryComponent
          }, 
          {
            path: "delete",
            component: DeleteConfirmDialogComponent
          },
          {
            path: "edit-auth",
            component: EditAuthEntry
          }, 
          {
            path: "fuse",
            component: FuseEntry
          },
        ]
      },
      { path: 'check-cupboard', component: CheckCupboardComponent,
        children: [
          {
            path: 'add',
            component: AdddArticleDialogWrapperComponent, 
            children: [
              {
                path: "article",
                component: AddArticleComponent,
                children: [
                  {
                    path: "edit-type/:idType",
                    component: EditTypeEntryComponent
                    
                  }
                ]
                
              },
          
              {
                  path: "type",
                  component: AddTypeComponent
              },
              {
                path: '**',
                redirectTo: 'article'
              }
              
            ]
          },
          {
            path: "edit/:id",
            component: EditArticleEntryComponent
          }
        ],
        data: {animation: 'CheckCupboard'}, canActivate : [AuthGuard, RootGuard] },
          ]
        },
  { path: 'time-table', component:TimeTableComponent, data:{animation: 'time-table'}, canActivate: [AuthGuard],
        children: [{
          path: 'new-event', component:NewEventEntryComponent, canActivate: [AuthGuard],
          children: [{
            path: 'repeater', component:RepeaterEntryComponent
          }]  
        }]
  },
  { path: '',   redirectTo: '/door', pathMatch: 'full'},
  //{ path: '**',   redirectTo: '/door', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
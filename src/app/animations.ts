import { trigger } from '@angular/animations';


import {
    state,
    style,
    animate,
    query,
    transition,
    group,
    animateChild
    // ...
  } from '@angular/animations';


export const Animations = trigger('triggerName', [
    transition('CheckCupboard => List', [
      query(':enter, :leave', [
        style({
          position: 'fixed', width: '100%' 
        })
      ], { optional: true }),
      query(':enter', [style({zIndex: "-1"})]),
      group([
        query(':leave', [animate('0.7s', style({ transform: 'translateX(-100%)'}))]),
        
       ])
       ]),
       transition('* => *', [
        query(':enter, :leave', [
          style({
            position: 'fixed', width: '100%' 
          })
        ] , { optional: true }),
        query(':enter', [style({zIndex: "-1"})], { optional: true }),
        group([
          query(':leave', [animate('0.7s', style({ transform: 'translateX(100%)'}))], { optional: true }),
          
         ])
       ])
    
]);

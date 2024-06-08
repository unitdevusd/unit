import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    data: {
      cache: false
    }
  },
  {
    path: 'register-role',
    loadChildren: () => import('./register-role/register-role.module').then( m => m.RegisterRolePageModule)
  },
  {
    path: 'register/:role',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },

  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    data: {
      cache: false
    }

  },
  {
    path: 'intro',
    loadChildren: () => import('./intro/intro.module').then( m => m.IntroPageModule)
  },
  // {
  //   path: '**',
  //   redirectTo: '',
  //   pathMatch: 'full'
  // },
  {
    path: 'filters',
    loadChildren: () => import('./filters/filters.module').then( m => m.FiltersPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'spaces',
    loadChildren: () => import('./pages/spaces/spaces.module').then( m => m.SpacesPageModule)
  },
  {
    path: 'space-detail/:spaceId',
    loadChildren: () => import('./pages/space-detail/space-detail.module').then( m => m.SpaceDetailPageModule)
  },
  {
    path: 'contact-host-modal',
    loadChildren: () => import('./pages/contact-host-modal/contact-host-modal.module').then( m => m.ContactHostModalPageModule)
  },
  {
    path: 'more-details-modal',
    loadChildren: () => import('./pages/more-details-modal/more-details-modal.module').then( m => m.MoreDetailsModalPageModule)
  },
  {
    path: 'success',
    loadChildren: () => import('./pages/success/success.module').then( m => m.SuccessPageModule)
  },
  {
    path: 'failure',
    loadChildren: () => import('./pages/failure/failure.module').then( m => m.FailurePageModule)
  },
  {
    path: 'host-space-detail/:spaceId',
    loadChildren: () => import('./pages/host-space-detail/host-space-detail.module').then( m => m.HostSpaceDetailPageModule)
  },
  {
    path: 'modify-rules-modal',
    loadChildren: () => import('./pages/modify-rules-modal/modify-rules-modal.module').then( m => m.ModifyRulesModalPageModule)
  },
  {
    path: 'modify-location',
    loadChildren: () => import('./pages/modify-location/modify-location.module').then( m => m.ModifyLocationPageModule)
  },  {
    path: 'image-modal',
    loadChildren: () => import('./pages/image-modal/image-modal.module').then( m => m.ImageModalPageModule)
  },
  {
    path: 'cashout',
    loadChildren: () => import('./pages/cashout/cashout.module').then( m => m.CashoutPageModule)
  },
  {
    path: 'add-account',
    loadChildren: () => import('./pages/add-account/add-account.module').then( m => m.AddAccountPageModule)
  },
  {
    path: 'auth-modal',
    loadChildren: () => import('./pages/auth-modal/auth-modal.module').then( m => m.AuthModalPageModule)
  },
  {
    path: 'time-slot-modal',
    loadChildren: () => import('./pages/time-slot-modal/time-slot-modal.module').then( m => m.TimeSlotModalPageModule)
  },
  {
    path: 'payment-modal',
    loadChildren: () => import('./pages/payment-modal/payment-modal.module').then( m => m.PaymentModalPageModule)
  },






];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

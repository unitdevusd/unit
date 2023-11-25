// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyCG21jxEX67NJX4xvTuK0jTrABW-TKHLQw",
    authDomain: "unit-session.firebaseapp.com",
    databaseURL: "https://unit-session-default-rtdb.firebaseio.com",
    projectId: "unit-session",
    storageBucket: "unit-session.appspot.com",
    messagingSenderId: "702532803931",
    appId: "1:702532803931:web:a652a2e21ab4a772a20e7e",
    measurementId: "G-GQFBCTK8JB"  
  },
  config: {
    url: 'https://gur.sandbox.imkloud.com'
  }

};


export const config = {
  // url: 'http://localhost:3000'
  url: 'https://gur.sandbox.imkloud.com'
}

export const KEY = {
  // apikey: 'YPBWEoixPMYs94QdW9n7kdqoy5n4iA' //local
  apikey: 'rGpTKMEZjs3RR5vcfwg6pujoA54i33'
}

export const URL = {
  signIn: '/api/v1/imli/signin',
  resetPassword: '/api/v1/imli/resetpassword',
  changePassword: '/api/v1/imli/changepassword',
  signUp: '/api/v1/imli/signup',
  updateProfile: '/api/v1/imli/updateprofile',
  forgotPassword: '/api/v1/imli/forgotpassword',
  getOnboardRoles : '/api/v1/imli/org/onboarding/meta',
  verifyToken : '/api/v1/imli/verify-token',
  imageUpload: '/api/v1/imli/storage/upload/base64image',
  reviews : '/api/v1/myrivu/public/reviews',
  countriesList: '/api/v1/imli/countries'
}

export const UNITURL = {
  sendOtp : '/api/v1/unit/sendOtp',
  verifyOtp : '/api/v1/unit/verifyOtp',
  allNotifications : '/api/v1/unit/allNotifications',
  markAsRead: '/api/v1/unit/markAsRead',
  mybookings: '/api/v1/unit/mybookings',
  spaces : '/api/v1/unit/spaces',
  placeMeta : '/api/v1/unit/placeMeta',
  myPlaces : '/api/v1/unit/myPlaces',
  storedItemtype : '/api/v1/unit/itemTypeList',
  updateStoredItemtype : '/api/v1/unit/updateItemType',
  deleteStoredItemtype : '/api/v1/unit/deleteItemType',
  addStoredItemtype: '/api/v1/unit/itemType',
  accessTimeList: '/api/v1/unit/accessTimeList',
  updateAccessTime : '/api/v1/unit/updateAccessTime',
  addAccessTime : '/api/v1/unit/addAccessTime',
  deleteAccessTimeType : '/api/v1/unit/deleteAccessTimeType',
  accessTypeList : '/api/v1/unit/accessTypeList',
  updateAccessType : '/api/v1/unit/updateAccessType',
  addAccessType : '/api/v1/unit/addAccessType',
  deleteAccessType : '/api/v1/unit/deleteAccessType',
  amenities : '/api/v1/unit/features',
  updateAmenity : '/api/v1/unit/updateFeature',
  addAmenity : '/api/v1/unit/addFeature',
  deleteAmenity : '/api/v1/unit/deleteFeature',
  revenueShareList : '/api/v1/unit/revenueShareList',
  updaterevenueShare : '/api/v1/unit/updaterevenueShare',
  addrevenueShare : '/api/v1/unit/addrevenueShare',
  deleterevenueShare : '/api/v1/unit/deleterevenueShare',
  adminNotfication : '/api/v1/unit/adminNotfication',
  spaceTypeList : '/api/v1/unit/spaceTypeList',
  updateSpaceType : '/api/v1/unit/updateSpaceType',
  spaceType : '/api/v1/unit/spaceType',
  deleteSpaceType : '/api/v1/unit/deleteSpaceType',
  bookedPlaces : '/api/v1/unit/bookedPlaces',
  addSpace : '/api/v1/unit/addSpace',
  updateSpace : '/api/v1/unit/updateSpace',
  publishSpace: '/api/v1/unit/publishSpace',
  removePlace : '/api/v1/unit/removePlace',
  editSpace : '/api/v1/unit/editSpace',
  getBookingDates : '/api/v1/unit/getBookingDates',
  getCustomerProfile : '/api/v1/unit/getCustomerProfile',
  createCustomerForPayments : '/api/v1/unit/createCustomerForPayments',
  booking : '/api/v1/unit/booking',
  createSubscription : '/api/v1/unit/createSubscription',
  chargeCustomer: '/api/v1/unit/chargeCustomer',
  addUserInformation : '/api/v1/unit/addUserInformation',
  getUserInformation : '/api/v1/unit/getUserInformation',
  updateUserInformation: '/api/v1/unit/updateUserInformation',
  bookingDetails : '/api/v1/unit/bookingDetails',
  placeWithTotalEarnings : '/api/v1/unit/placeWithTotalEarnings',
  deleteCustomerProfile : '/api/v1/unit/deleteCustomerProfile',
  cancelBooking : '/api/v1/unit/cancelBooking',
  getCountForAdmin : '/api/v1/unit/getCountForAdmin',
  removeDevice : '/api/v1/unit/removeDevice',
  schedulePickup : '/api/v1/unit/schedulePickup',
  extensionRequest : '/api/v1/unit/extensionRequest',
  approveExtension : '/api/v1/unit/approveExtension',
  saveDevice : '/api/v1/unit/registerDevice',
  addToken: '/api/v1/unit/addToken',
  sendInvite: '/api/v1/unit/sendInvite',
  updateRole: '/api/v1/unit/updateRole'
};


export const configEmail = {
  siteName: "",
  from: "",
  subject: "",
  resetUrl: "",
  team: ""
};

export const CTA = {
  // cta Url
  url : '/api/v1/cta/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

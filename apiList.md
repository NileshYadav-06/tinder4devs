 # Tinder4Devs APIs

## authRouter
 - POST /singup
 - POST /login
 - POST /logout

## profileRouter
 - GET /progile/view
 - PATCH /progile/edit
 - PATCH /progile/password

## connectionRequestRouter
 <!-- - POST /request/send/interested/:toUserId -->
 <!-- - POST /request/send/ignored/:userId -->
 POST /request/send/:status/:toUserId 
 <!-- Handles above routes -->

 <!-- - POST /request/review/accepted/:requestId -->
 <!-- - POST /request/review/rejected/:requestId -->
POST /request/review/:status/:requestId
<!-- Handles its above routes -->

## userRouter
 - GET /user/request/recieved    <!-- Get all the pending connection request-->
 - GET /user/connections 
 - GET /user/feed - Gets you the profiles  of other on platform


  Status: ignored, interested, accepted, rejected
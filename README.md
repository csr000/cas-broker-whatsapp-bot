<<<<<<< HEAD
1
- Request for cargo truck => a
- Register us a ruck driver or truck owner => b
- Speack to human => c

2
- Condition for a
    if a:
      (msg) we need to collect some details in order to keep you going, let's start by telling us your name
      answer: steven
      (msg2) Tell us the name of your company or where you work, if you dont have any, type NONE
      answer: millewebs
      (msg3) Great!, let us know yoor physical address. eg: AS-DF-12-04 or spindex comm. 18, lamar street
      answer: AS-32-00-DS
      (MSG4) which telephone number can we reach you on
      answer: 0245202558
      (MSG5) which email number can we reach you on
      answer: mail@mail.com
      (MSG6) <button>Are you doing a local job or a transit job? </button>
              b1=transit
              b2=local
      answer: local
      (MSG7) tell us which port or location to pickup/load your cargo
      answer: Tema
      (MSG8) specify what type of cargo
      answer: bulk
      (MSG9) what date do you want your cargo to be picked up/loaded, please use the date format DD/MM/YYYY or 11/01/2023
      answer: 11/01/23
      (MSG10) identify the pickup location, if other specify
      answer: other
      if other, then msg "kindly tell us your pickup location" 

      (MSG11) tell us where the cargo is going/ to what destination
      answer: **** SELECT FROM PREDEFINED ROUTES/ SPECIFY OTHER**********
      (MSG12) please decribe the type of cargo you want to load
      answer: food stuff
      (MSG13) tell us the size of the container
      answer: other
      (MSG14) how many containers do you want to load
      answer: 3
      (MSG15) what type of truck do you need
      answer: other
      (MSG16) what are the number of truck you would need
      answer: 3
      (MSG17) what is the combined total weight(kg) of the cargo. eg: 100000
      answer: 10000
      (MSG18) DO YOU PREFER GOODS IN TRANSIT INSURANCE COVER
      answer: yes
      (MSG19) what is you offer per truck (ghc), eg: 2500
      answer: 2500
      (MSG20) MODE OF PAYMENT
      answer: momo
      (MSG21) HOW MANY DAYS do you intend to make paayment AFTER DELIVERY
      answer: 1
      (MSG22) specify your demurrage date (FREE DAYS TO END), please use the date format DD/MM/YYYY or 11/01/2023
      answer: 11/01/2023
      (MSG23) please provide bill of laden nmber (BOL NUBMER)
      answer: 74455775
      (MSG24) select which CHANNEL :CRM
      answer: green
      (MSG25) please enter the phone number of the recipient
      answer: 0256358892
      (MSG26) do you have ANY SPECIAL INSTRUCTIONS ?
      answer: handle with caution
      (MSG26) kindly identify DANGEROUS CARGO ?
      answer: no 
      (MSG26) T&C
      answer: I AGREE
      (MSG26) DISCLAIMER + GET MY RATE BTN
      answer: GET RATE
      (MSG26) YOUR RATE ITS <RATE>, if you approve the rate kindly select pay now. You may recieve a prompt or redircected to a payment portal depending on your mode of payment. if you still have further enquires, p lease select contact suppport. 
      b1: pay now
      b2: talk to support
      answer: talk to support
      (msg) <SEND SUPPORT'S CONTACT>
      answer: pay now
      (msg) <MOMO PROMPT>
      if payment successfull: then send contact number of driver to customer + invoice to customer (pdf) + location of driver . 

============================================
TRUCK DRIVER
=============================================

IF (Register us a Truck driver ) 

msg : we're glad to have you show interest to be registered on our platform, lets start with entering your first name. eg john as seen on your driver's license
ans: kofi

msg: enter your last name/ surname as seen of your dvla
ans: brofo

msg: enter your phone number that we may contact you on
ans: 0245339972

msg: tell us the registration number of your truck eg GR 042 52 
ans: GR 042 52 

msg: enter the REf# eg: 100009900G4 on your drivers license ID
ans: 205525154

msg: what type of truck do you have ?
ans: select from list -> 40ft . . . 

msg: what is/are the number of axels for your truck
ans: 2

msg: what is the maximum weight (KG) capacity eg. 20000
ans: 40000

msg: What is the reliable parking location for your truck eg. AS-463743_GE or Dzorwulu, main st.
ans: accra Ga

msg: What is the name of your Mate, Please enter the first name
ans: Kwame

msg: What is the lastname of your Mate
ans: Ofori

Msg: Please enter the phone or contact number of your mate
ans: 027389466

Msg: Thank your for registering with us. Our representatives will reach out shortly to complete your registration. in the meantime visit us at casbroker.com/login and use the username kofi823 password i#$ud to complete your registration and start recieving great offers. You can also call the number below for further enquiries. Thankyou

Send [contact]
=======

>>>>>>> 72f6013d0f7e054535c62119d66ea5238a926012

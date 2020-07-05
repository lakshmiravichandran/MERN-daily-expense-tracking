# INFSCI 2560 Final Report
#### Spring 2020
---
### Group: Monthly-Bills
### Team Members

- Youwei Ma (yom26@pitt.edu)
- Lakshmi Ravichandran (lar146@pitt.edu)
- Soundarya N Sravan (sos55@pitt.edu)
- Sayantani Bhattacharjee (sab301@pitt.edu)
---

## Introduction

This project is called ReserveFund - expense manager, in which we can be better prepared for the monthly bills. It is a MongoDB + Express.js + Node.js based expense tracking web application.​ It helps the user to add expenses and track the spending with summary statistics report and budget planning by maintaining a limit.​ This web application is not designed to be connected to a user's bank account details. It is used independently to track one's spending based on the user's records.

## Objectives:

> ### Goals and functionalities

> The goal of the project is to provide tools for users to effectively handle their financial resources.   
  The user is given freedom to add their expenditure and decide whether or not to set limits on the said monthly expenditures.  
  User can check summary statistics report and can update the expense limit.  
  User can also look up for the expenses for a time period for a specific category or all category.
  Automatic email notification when user expenses cross the limit set.  
  This, combined with the fact that the application does not use the user's personal bank details, allows for a relaxed, but effective set up to improve financial resources.  
  Administrators can login and view the list of all users of the application. They can send promotions through email to all the registered users.  

> ### Things to learn

> The architecture of Model-View-Controller (MVC) is emphasized again in this project, by keeping models in database, displaying views to the pages, and implementing controllers in routes. The construction of this project help us better understand the architecture. And with EJS, we made it a component-based application. For techniques, the project involves a massive use of Bootstrap library in the front-end, as well as many MongoDB operations in the back-end including find, aggregate etc., which help to develop these skills. Also, reviewing the use of HTML5 tags, JavaScript, RESTful APIs, EJS, and authentication with Passport.js which were covered in lectures. 

> ### Additional features implemented

> - Data Visualization  
  Bar chart - expenditure based on category for the current month.
  Line Chart - the monthly trends of spending activity and sorted by time to visually see any spikes in expenses.
  Mixed chart - Bar Showing non-recurring expenses (excluding recurring Bills & Utilities and Education) across months. Line showing the user set limit. While recurring expenses are something that a user cannot control, this helps user see how far he is from the limit to plan his budget accordingly.

> - Email Alert System  
  During sign up, user is asked to set an expenditure limit. This limit is then compared against total expenditure of the individual. If after adding a transaction, the total is found to be greater than the limit, an email will be automatically sent to the user stated that they have crossed their limit.

> - Promotion Email  
  A promotion email can be sent to all users at the same time if the Admin desires.

## Team member’s contributions

- Youwei Ma: Front-end development, Code integration
- Lakshmi Ravi: Parts of the Front-end and Back-end, Data Visualization, Creating / Reading records, Advanced Search Views
- Soundarya: Back-end development, Form validations, Database Management, Authentication and Session Management using Passport.js.
- Sayantani Bhattacharjee: Back-end development, Automated Email Alert System, Promotion Email.

## Technical Architecture

It consists of 3 models-User, Expense, Admin, which define the MongoDB schema. The views keep all front-end pages and components written by HTML and EJS. The controller is defined in routes and server and they carry out the interaction between front and back end. These three parts combined together to form the MVC architecture. Pick "sign in" as a example, the sign in page is shown in views waiting for inputs; the inputs will be handled by controller that being stored in DB, and then the controller updates the view to homepage.  

There is no frameworks, instead we used Express.js and EJS and made it a light weight component-based web application. The components can be reused in other pages and show different layouts according to special properties.   

The libraries include Bootstrap, chart.js and Date picker.

## Challenges

- Google OAuth 2.0 authentication for sign in -  
  The authentication allowed the user to sign in, however, it was difficult to maintain the session for the user.
- Email alert using Gmail and Nodemailer -  
  The original idea was to use Gmail as sender, however, after some failed attempts and a bit of research, we decided to go with Outlook as the sender email service. (Gmail may work very well or may not work at all, in combination with Nodemailer)
- UI -  
  There are lots of things we tried to make but failed. One is the pagination for admin panel (since there will be a long list). It is said Bootstrap provides auto-pagination for table after v4.0 by simply add a section of script, however we failed to do so. Another example is the popover that will be shown after clicking any object. It's designed to show this element for password since there is a strict restriction for the password generating. We also failed to do so as a trade-off there is a tooltip, which is less clear.
- Design for expense management tab -  
  Just illustrating a technical difficulty: the page "manage_expenses" keeps all contents of the tabs (this is called by Bootstrap component's feature), which means we have to implement a very complicated route for it (adding expenses, showing records, posting queries for MongoDB manipulation, statistics chart, all together). We found alternative ways to divide them apart.  
- Glitch synchronization issue -  
  This is really challenging, since we worked at four different places while sometimes the changes were not synchronized so that it led to disaster (e.g. formation of structured languages). Glitch itself provides good collaborative features, however it may not be the best solution for collaboration, since coding is not just writting down words.
- Hard to debug issue - "Error: Can't set headers after they are sent." This error is seen in glitch logs after submitting add expense request. More details in known issues below.

## Future Work

- Google OAuth2.0 Authentication -  
  It would be interesting to learn how to maintain the session after the sign-in.
- Separate session for regular users and admin -  
  By now these two user groups share the same session so they cannot presenting at the same time. 
- Renew the expense management tab -  
  Page can be refactored so as to update the business process. Example - for "advanced search" we can include more searching fields with more flexible search functionalities; Statistics could have more models and give recommendations to set proper budget limit using Machine Learning.
- Fixed some error -  
  Now this application still contains some minor flaws (not bug), will fix them in the furture work.

## Conclusion

This project is a good review of lectures, because the project incorporates technnologies and standards learnt in the lectures. We have used additional frameworks and technologies to implement some application features. Lectures covered modern web technologies, making it easy to understand and helped us develop this application. Moreover, Bootstrap provides great components and layouts which saves a lot of time and effort for front-end developers.  

## ResourcesList

#### Nodemailer 
- [https://www.w3schools.com/nodejs/nodejs_email.asp](https://www.w3schools.com/nodejs/nodejs_email.asp)
- [https://ourcodeworld.com/articles/read/264/how-to-send-an-email-gmail-outlook-and-zoho-using-nodemailer-in-node-js](https://ourcodeworld.com/articles/read/264/how-to-send-an-email-gmail-outlook-and-zoho-using-nodemailer-in-node-js)
- [https://support.glitch.com/t/why-isnt-nodemailer-working/17530](https://support.glitch.com/t/why-isnt-nodemailer-working/17530)
#### Session Management, Login Authentication and form validation
- [http://www.passportjs.org/packages/passport-local/](http://www.passportjs.org/packages/passport-local/)
- [https://flaviocopes.com/express-validate-input/](https://flaviocopes.com/express-validate-input/)
- [https://auth0.com/blog/express-validator-tutorial/](https://auth0.com/blog/express-validator-tutorial/)
#### Chart.js graphs 
- [https://tobiasahlin.com/blog/chartjs-charts-to-get-you-started/](https://tobiasahlin.com/blog/chartjs-charts-to-get-you-started/)
- [https://www.chartjs.org/docs/latest/charts/mixed.html](https://www.chartjs.org/docs/latest/charts/mixed.html)
- [https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext)
#### Bootstrap components
- [https://getbootstrap.com/docs/4.4/components/alerts/](https://getbootstrap.com/docs/4.4/components/alerts/)
#### Mongo
- [https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/](https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/)
#### Datepicker
- [https://formden.com/blog/date-picker](https://formden.com/blog/date-picker)
- [bootstrap-datepicker sandbox](https://uxsolutions.github.io/bootstrap-datepicker/?markup=input&format=&weekStart=&startDate=&endDate=&startView=0&minViewMode=0&maxViewMode=4&todayBtn=false&clearBtn=false&language=en&orientation=auto&multidate=&multidateSeparator=&keyboardNavigation=on&forceParse=on#sandbox)

## Specific instructions for testing

- Admin credentials (for admin panel only):
  * name: admin2
  * pwd: Admin2@1234
- An created regular user account:
  * name: tina
  * pwd: 123@tina
- Please create a new account with a real email address if you want to try the emailing.

## Known issues:

- LATEST: A known limitation is an issue that we faced just before presentation. After adding expenses we just see a blank page most of the times. The issue is not seen if you logout and login and for the first transaction; Also, the issue is not seen if the browser cache and cookies are cleared. This maybe an issue with server-side rendering once the transaction is added. Since this works sometimes this looks like a timing/ race issue. The error log shown in JS console is "Failed to load resource: net::ERR_HTTP2_PROTOCOL_ERROR 200". We debugged this by turning off the rendering in the postexpense route and returning the json from mongodb query. And the glitch logs indicate "Error: Can't set headers after they are sent." error when rendering the page.

- The total expense triggering the "expenditure alert" email is calculated by all expenses, which means it will not clear to zero at the new month. This is because we haven't implemented posting current month as search condition functionality.  
 
- If you login to both regular homepage and admin panel, one of the account will be logged off, since they are sharing the same session.   

- If you login to admin panel as an admin and click the website brand, you will be led to regular homepage with losing the session.
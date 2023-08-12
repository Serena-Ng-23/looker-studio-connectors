# looker-studio-connectors
Looker Studio connectors are developed to connect data sources to Looker studio to centralize all data sources into a visualization dashboard 
#### Create a project in Google Cloud Platform
Before you develop a connector, you need to access Google Cloud Platform and create a new project for your connector at link : https://console.cloud.google.com/
1. Click to create a new project
2. Access APIs & services -> access library and enable Google services, which you would like to use and develop for connector. For an example: enable Google AdSense Managenemnt API
3. Configure OAuth consent screen. Fill your email and just click next steps as default. Please make sure you pulishing the consent
4. Depending on the service that you nee to create a credential for connector. AdSense & URL Fetch is OAuth client ID, Google Ad Manager is Service Account
5. Add Authorized redirect URIs with the structure here : https://script.google.com/macros/d/{Scrip ID in Google App Script project}/usercallback


## Create a new project in Google App Script
Accessing this page : https://script.google.com and create a new project for AdSense connector
![image](https://user-images.githubusercontent.com/78246941/165710249-518dcd9f-c956-4878-be99-31699f6f45ab.png)
1. Enable OAuth Client library. In Resources Libraries, to enable this library by finding this code: **1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF**
2. Create a new project in Google Cloud Platform and make //usercallback in credential pages

## CREATE ADSENSE CONNECTOR FOR DATA STUDIO 
1. Enable AdSense service in Advanced Google Services
![image](https://user-images.githubusercontent.com/78246941/165710651-4b133fc9-c560-4f75-a66b-0e5bb34fcd02.png)
2. Enable AdSense Management API in Google Cloud Platform project

## CREATE GOOGLE AD MANAGER CONNECTOR FOR DATA STUDIO
1. Create a service account in Google Cloud Platform for your project
2. Add the service account email to Google Ad Manager in Admin -> Access & authentication

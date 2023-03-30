# online shop with chat room and video call

+ Demo website: https://test8812.foodpass.club/entrance
+ Test Account and Password 
  - (Clinet -- account : customer1 , password : customer1)
  - (Owner -- account : admin , password : admin)
  
![Alt Text](https://d3ce9biuqz84nv.cloudfront.net/client_1.gif)
## catalogue
- [Feature](#Feature)
- [System Architecture](#System_Architecture)
  - [System Design](#System_Design)
  - [Communication](#Communication)
- [Backend Technique](#Backend_Technique)
  - [Key Points](#Key_Points)
  - [Infrastructure](#Infrastructure)
  - [Environment](#Environment)
  - [Database](#Database)
  - [Database Schema](#Database_Schema)
  - [Networking](#Networking)
  - [Unit Test](#Unit_Test)
- [Frontend Technique](#Frontend_Technique)
  - [css](#css)
- [Cloud Services](#Cloud_Services)
- [Version Control](#Version_Control)
- [CICD](#CICD)
- [API Doc](#API_Doc)
- [Contact](#Contact)


<h2 id ="Feature">Feature</h2>
+ Real-Time chat and history message

![Alt Text](https://d3ce9biuqz84nv.cloudfront.net/real_2.gif)

+ Video Call 
![image](https://d3ce9biuqz84nv.cloudfront.net/video_2.gif)

+ user page to update product information and confirm order status
![Alt Text](https://d3ce9biuqz84nv.cloudfront.net/userpage_1.gif)


<h2 id ="System_Architecture">System Architecture</h2>
<h3 id ="System_Design">System Design</h3>
<img width="100%" alt="pipline" src="https://user-images.githubusercontent.com/101098094/226040302-bea348f7-6798-4be7-9d4c-c0031bc2ccfb.png">
<h3 id ="Communication">Communication</h3>
<img width="100%" alt="pipline" src="https://d3ce9biuqz84nv.cloudfront.net/socket-architecture.png">



<h2 id ="Backend_Technique">Backend Technique</h2>
<h3 id ="Key_Points">Key_Points</h3>
<ul>
  <li>MVC pattern</li>
  <li>Websocket</li>
  <li>peerjs</li> 
  <img width="100%" alt="pipline" src="https://d3ce9biuqz84nv.cloudfront.net/peerjs.png">
</ul>

<h3 id ="Infrastructure">Infrastructure</h3>
<ul>
  <li>Docker-compose</li>  
</ul>
<h3 id ="Environment">Environment</h3>
<ul>
  <li>Node.js/Express.js</li>  
</ul>
<h3 id ="Database">Database</h3>
<ul>
  <li>AWS RDS(mysql)</li>  
</ul>
<h3 id ="Database_Schema">Database_Schema</h3>
<h3 id ="Networking">Networking</h3>
<ul>
  <li>HTTP & HTTPS</li>
  <li>Domain Name System (DNS)</li>
  <li>SSL (sslforfree)</li>  
  <li>NGINX</li>  
  <li>Docker</li>  
</ul>
<h3 id ="Unit_Test">Unit_Test</h3>



<h2 id ="Frontend_Technique">Frontend Technique</h2>

<h2 id ="Cloud_Services">Cloud Services</h2>
<ul>
  <li>AWS EC2 : Backend host machine</li>
  <li>AES S3 : Store images and videos</li>
  <li>AWS cloudfront : Speeds up distribution of images and videos in S3</li>
  <li>AWS RDS : Store data,including chat history,member information and products information</li>
</ul>

<h2 id ="Version_Control">Version Control</h2>
<ul>
  <li>Git/Github</li>  
</ul>

<h2 id ="CICD">CICD</h2>
<ul>
  <li>Git Action</li>  
</ul>
<h2 id ="API_Doc">API Doc</h2>

<a href="https://app.swaggerhub.com/apis/webber0971/kjkj/1.0.0" target="_blank">RESTful API documentation</a>

<h2 id ="Contact">Contact</h2>
李緯宸 (wei-chen li)
Email: webber0971@gmail.com

# Collaborative Editor
Final Project by Do Hyung (Dave) Kwon and Shyam Paidipati for ECE 465 Cloud Computing. 
## Project Goal
Create a real-time collaborative editor that can be simultaneously edited by multiple users. The system supports createing, deleting, sharing, and editing documents. The system function similar to popular existing services, such as Google Docs and Overleaf.  
## Dependencies
* React
* Quill
* Material-UI
* Express js
* ShareDB
* MongoDB
## Project Description
The system is divided into three primary components: client, server, and MongoDB. The project can be deployed locally or on AWS using docker-compose ECS and AWS Cloudformation. Since client, server, and MongoDB are deployed in ECS Service on AWS, these services can be automatically scaled with replicas depending on the load. It supports healthcheck on the system so that, if the service is malfunctioning, ECS Cluster will restart the service.
### Front End
We use React for serving our front end client to users. The client mainly uses Material-UI for UI framework and Quill for WYSIWYG editor. Users will be able create, edit, share, and delete documents using the client. 
### Back End
We use Express js for creating backend server to handle all request for accessing data in MongoDB. For collaborative editing, we use ShareDB, a [Operational Transformation (OT)](https://en.wikipedia.org/wiki/Operational_transformation) framework. ShareDB communicates with the client using WebSocket for low latency. It also directly communicates with MongoDB for persistence.
### MongoDB
We use MongoDB to store both metadata and operational transformation from ShareDB for each document. Metadata includeds title and access control. 
## System Archtiecture on AWS
![Architecture](images/architecture.png)
## Deployment
The system currently supports deploying locally with docker-compose or on AWS with docker-compose ECS. 
Refer to [BUILD.md](BUILD.md) for setting up environment and [INSTALL.md](INSTALL.md) for deploying locally or on AWS.
## Future Work
* Explore DocumentDB in AWS for replace MongoDB ECS Service
* Better UI/UX
## [Presentation Slides](https://docs.google.com/presentation/d/e/2PACX-1vQL80X3eEtKfeL-Q7mCkrRyv0-uwKQwc4Vrefkbz8oIpE1UZ_2HhfqFVb4G9YN4xBCa2G2iJuSuWPrq/pub?start=false&loop=false&delayms=3000)
## Presentation Video
[![Navigation](https://img.youtube.com/vi/lZMsAW8PB_A/0.jpg)](https://youtu.be/lZMsAW8PB_A)
## References
* [react-aws-cognito-example](https://github.com/patmood/react-aws-cognito-example)


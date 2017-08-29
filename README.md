# Kartoffel - 0.1.3

## CI Information
### Build Status
[![Build Status](https://travis-ci.org/AllKinds/Kartoffel.svg?branch=master)](https://travis-ci.org/AllKinds/Kartoffel)

## Getting Started
### Installation
        npm install

### Testing
        npm test

### Running the server
        npm start

## API Endpoints
### 1. User
| Method 	| Endpoint          	            | Description                    	        | Required Permissions  	| Example           	|
|--------	|--------------------------------   |----------------------------------------   |-----------------------	|-------------------	|
| GET    	| /api/user/getAll     	            | Returns all the users            	        | None                  	| /api/user/getAll     	|
| POST    	| /api/user          	            | Create new user                	        | None (yet)              	| /api/user          	|
| GET           | /api/user/:id                     | Get user by his ID                        | None                          | /api/user/1234567     |
| DELETE        | /api/user/:id                     | Remove a user by his ID                   | None (yet)                    | /api/user/1234567     |
| PUT           | /api/user/:id/personal            | Update user's personal info by his ID     | None (yet)                    | /api/user/1234567     |

### 2. Strong Groups
| Method 	| Endpoint          	            | Description                    	        | Required Permissions  	| Example           	        |
|--------	|--------------------------------   |----------------------------------------   |-----------------------	|----------------------------   |
| GET    	| /api/kartoffel/getAll             | Returns all the kartoffeln      	        | None                  	| /api/kartoffel/getAll     	|
| POST    	| /api/kartoffel                    | Create new kartoffel             	        | None (yet)              	| /api/kartoffel          	|
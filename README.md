# comments_app

The app designed to have a nice conversation between users. User can create posts and share their thoughts in replies.

Guest user can:
- browse posts
- open post details and see replies

Registered user can:
- Create new post
- Reply to a post
- reply to another reply
- Attach images and .txt files to their reply.

The app is hosted and available:
https://comments-app-frontend.onrender.com/

API docs are available at:
https://comments-app-backend-pl9f.onrender.com/swagger/


## Technologies used:

- DRF for creating REST API
- React as frontend SPA
- PostgreSQL as relational database
- Redis as key-value storage

### additional technologies:

- Material UI for styling
- Websockets to add replies without page reload
- Docker & Docker compose
- JWT for session management
- Google reCAPTCHA on registration

## Runing app locally using Docker Compose

The app has docker-compose file that includes all services needed to run the app locally. The only thing which points outside is S3 bucket. You should execute all commands from the root folder (the same folder where README.md is located)

1. create .env file in the root folder. Use env-example as a template.
Structure should be:
```
> backend
> frontend
.env
docker-compose.yml
```

2. run `docker-compose build --no-cache`
3. run `docker-compose up`
4. main app is available at 
`your-frontend-host:port`
API docs are available at 
`your-backend-host:port/swagger` or `your-backend-host:port/redoc`

## Run Locally

Clone the project

```bash
  git clone https://github.com/takahiromitsui/nest-prisma-chat.git
```

Install dependencies

```bash
  yarn install
```

Add env variables on .env
```bash
  DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

Start the server

```bash
  yarn start:dev
```

## Database

![chat-app-schema](https://user-images.githubusercontent.com/78789212/228848677-2c90c661-630e-452c-b25d-fab40bc03180.png)



## API Reference
### Introduction
This API provides endpoints for managing users and rooms.

### Base URL
The base URL for the API is http://localhost:3000.

### Authentication
Authentication is not currently required for any endpoints.

### Endpoints
#### Users
- `GET /users` - Retrieves a list of all users
- `GET /users/:id` - Retrieves a single user by ID
- `POST /users` - Creates a new user
- `PATCH /users/:id` - Updates an existing user by ID
- `DELETE /users/:id` - Deletes a user by ID

#### Rooms
- `GET /rooms` - Retrieves a list of all rooms
- `GET /rooms/:id` - Retrieves a single room by ID
- `POST /rooms` - Creates a new room
- `PATCH /rooms/:id` - Updates an existing room by ID
- `DELETE /rooms/:id` - Deletes a room by ID

#### RoomUsers
- `GET /room-users/:id` - Retrieves a single room user by ID
- `POST /room-users` - Creates a new room user
- `PATCH /room-users/:id` - Updates an existing room user by ID
- `DELETE /room-users/:id` - Deletes a room user by ID

#### Messages
- `GET /messages/:id` - Retrieves a single message by ID
- `POST /messages` - Creates a new message
- `PATCH /messages/:id` - Updates an existing message by ID
- `DELETE /messages/:id` - Deletes a message by ID

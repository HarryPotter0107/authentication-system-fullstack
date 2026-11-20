# OneDAO – Full-Stack JWT Authentication System

A full-stack user authentication and product management application built using **Java Spring Boot, React.js, PostgreSQL, and JWT**.

The application provides secure user registration and login, role-based access control, JWT authentication, logout functionality, administrator management, and product CRUD operations.

## 🚀 Technology Stack

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- BCrypt Password Encryption
- Maven
- Swagger / OpenAPI

### Frontend
- React.js
- Vite
- JavaScript
- Axios
- React Router DOM
- CSS

### Database
- PostgreSQL – Product data storage
- ConcurrentHashMap – In-memory user storage

## ✨ Features

### Authentication & Authorization
- User registration and login.
- JWT-based authentication.
- Password encryption using BCrypt.
- Token expiration and validation.
- Secure logout with token blacklisting.
- Protected API endpoints.

### Role-Based Access Control
Two user roles are supported:

- **Standard User:** Access to dashboard and product management.
- **Administrator:** Access to administrator dashboard, user management, settings, and product management.

Public registration assigns the Standard User role by default.

### User Management
- View registered users.
- Retrieve user details.
- Delete users.
- Restrict administrator features to authorized users.

### Product Management
- Create products.
- Retrieve product details.
- Update products.
- Delete products.
- Store product information in PostgreSQL.

### Additional Features
- Country-based registration restrictions for Syria, Afghanistan, and Iran.
- Input validation for username, email, and password.
- Centralized exception handling.
- Swagger API documentation.
- CORS configuration for frontend integration.

## 📁 Project Structure

```text
AuthenticationSystem/
│
├── src/
│   └── main/
│       ├── java/com/OneDao/
│       │   ├── config/
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── entity/
│       │   ├── enums/
│       │   ├── exception/
│       │   ├── filter/
│       │   ├── repository/
│       │   ├── security/
│       │   ├── service/
│       │   └── store/
│       │
│       └── resources/
│           └── application.properties
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── index.html
│
├── pom.xml
├── mvnw
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/HarryPotter0107/authentication-system-fullstack.git
cd authentication-system-fullstack
```

### 2. Configure PostgreSQL

Create a PostgreSQL database:

```sql
CREATE DATABASE onedao;
```

Configure your database credentials in `src/main/resources/application.properties`.

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/onedao
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 3. Configure Administrator Credentials

Set these environment variables in your backend run configuration:

```text
ADMIN_USERNAME=your_admin_username
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

The application uses these values to initialize the administrator account.

### 4. Run the Backend

From the project root directory:

```bash
./mvnw clean install
./mvnw spring-boot:run
```

Backend URL:

```text
http://localhost:8081
```

### 5. Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL (Vite may select another available port):

```text
http://localhost:5173
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| POST | `/api/auth/logout` | Logout and invalidate token |
| GET | `/api/dashboard` | Access user dashboard |
| GET | `/api/admin/users` | Retrieve all users |
| GET | `/api/admin/users/{id}` | Retrieve user details |
| DELETE | `/api/admin/users/{id}` | Delete a user |
| GET | `/api/admin/settings` | Retrieve administrator settings |
| GET | `/api/products` | Retrieve products |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/{id}` | Update a product |
| DELETE | `/api/products/{id}` | Delete a product |

Protected endpoints require a valid JWT:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📖 API Documentation

Swagger UI:

[http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html)

Use Swagger UI or Postman to test the REST APIs.

## 🔐 Security Notes

- Passwords are stored as BCrypt hashes.
- JWT tokens are validated by a custom authentication filter.
- Logged-out tokens are blacklisted until their expiry.
- Administrator endpoints require administrator authorization.
- Country restrictions are applied during registration.
- User accounts and token blacklist entries are stored in memory and are cleared when the backend restarts.

For production deployment, configure secure secrets, persistent token revocation, and production-specific CORS and geolocation settings.

## 👨‍💻 Author

**Bhanu Upadhyay**

Java Backend / Full Stack Developer

GitHub: [HarryPotter0107](https://github.com/HarryPotter0107)

---

**Project:** OneDAO – Full-Stack JWT-Based Authentication System

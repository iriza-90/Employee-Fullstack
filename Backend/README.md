Employee Management System (Backend)

A RESTful API for managing employees with authentication, validation, and search capabilities. Built with Node.js, Express, and PostgreSQL.

📌 Features
✅ JWT Authentication (Signup/Login)
✅ CRUD Operations for Employees
✅ Search Employees by name/email
✅ Pagination for employee lists
✅ Input Validation & Error Handling
✅ Swagger API Documentation

🚀 Setup
1. Prerequisites
Node.js (v18+)

PostgreSQL (v12+)

Git

2. Installation
bash
# Clone the repo
git clone https://github.com/your-repo/employee-management.git
cd employee-management/backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
Edit .env:

env
JWT_SECRET=your_jwt_secret_here
DB_HOST=localhost
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=employee_db
PORT=5000
3. Database Setup
bash
# Create database and run migrations
npx sequelize-cli db:create
npx sequelize-cli db:migrate

# Optional: Seed admin user
npx sequelize-cli db:seed:all
4. Run the Server
bash
npm start
API will run at http://localhost:5000.

📚 API Endpoints
Endpoint	Method	Description	Auth Required
/api/auth/signup	POST	Register a new admin	No
/api/auth/login	POST	Login (returns JWT token)	No
/api/employees	GET	List all employees (paginated)	Yes
/api/employees/search	GET	Search employees by name/email	Yes
/api/employees	POST	Add a new employee	Yes
/api/employees/:id	PUT	Update an employee	Yes
/api/employees/:id	DELETE	Delete an employee	Yes
🔐 Authentication
Pass the JWT token in the Authorization header:

http
Authorization: Bearer <your_token>

🛠️ Packages Used
Core
Package	Purpose
express	Web framework
sequelize	ORM for PostgreSQL
pg	PostgreSQL client
jsonwebtoken	JWT authentication
bcryptjs	Password hashing
Validation & Security
Package	Purpose
joi	Request schema validation
dotenv	Environment variables
cors	Cross-Origin Resource Sharing
Documentation
Package	Purpose
swagger-jsdoc	Generate API docs
swagger-ui-express	Serve Swagger UI
Dev Dependencies
Package	Purpose
sequelize-cli	Database migrations
nodemon	Auto-restart server (dev)

📝 Validation Rules
Employee Fields
Field	Rules
firstName	Required, min 2 chars
lastName	Required, min 2 chars
email	Required, valid email, unique
salary	Positive number
hireDate	Valid ISO date (YYYY-MM-DD)
🔧 Error Handling
Standard error responses:

json
{
  "error": "Descriptive message",
  "details": ["Additional context"]  // Optional
}
HTTP Status Codes:

400: Validation error

401: Unauthorized

404: Not found

500: Server error

📖 API Documentation
Access Swagger UI at:
http://localhost:5000/api-docs
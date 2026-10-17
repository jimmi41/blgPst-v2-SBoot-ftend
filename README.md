# ThalediNama

A blog built with Java 17, Spring Boot, Thymeleaf, and MySQL.

## Run locally

Start MySQL and ensure the database and `post` table already exist. Automatic schema creation is disabled.

Copy the example configuration before running or packaging a fresh checkout. The local `application.properties` file is ignored by Git; keep credentials out of the example file.

```powershell
Copy-Item .\src\main\resources\application.properties.example .\src\main\resources\application.properties

$env:DATABASE_URL = "jdbc:mysql://localhost:3306/blogpost"
$env:DATABASE_USERNAME = "your-database-user"
$env:DATABASE_PASSWORD = "your-database-password"
$env:USERNAME = "blogadmin"
$env:PASSWORD = "your-admin-password"
$env:ROLE = "ADMIN"

.\mvnw.cmd spring-boot:run
```

Replace the database name and credential values, then run Maven in the same terminal session. When deploying a packaged application, provide the required environment variables in the deployment environment as well.

Open `http://localhost:8080/` for the blog, `/aboutMe` for the author page, and `/adminPage` to manage posts.

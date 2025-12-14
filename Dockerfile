# Stage 1: Build Angular frontend
FROM node:20 AS frontend-build

WORKDIR /app/frontend

# Copy package files and install dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy source and build (override outputPath for Docker)
COPY frontend/ ./
RUN npm run build -- --output-path=dist

# Stage 2: Build Spring Boot backend
FROM eclipse-temurin:21-jdk AS backend-build

WORKDIR /app

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Copy pom.xml and download dependencies
COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B

# Copy backend source
COPY backend/src ./src

# Copy Angular build output to static resources
COPY --from=frontend-build /app/frontend/dist/browser ./src/main/resources/static/

# Build the JAR
RUN mvn package -DskipTests

# Stage 3: Runtime
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=backend-build /app/target/business-management-suite-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

# Dockerfile para service-auth (Autenticación JWT, BCrypt & RBAC)
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copiar POMs y Shared Kernel para cache de dependencias
COPY pom.xml ./
COPY shared-kernel/pom.xml ./shared-kernel/
COPY api-gateway/pom.xml ./api-gateway/
COPY service-auth/pom.xml ./service-auth/
COPY service-inventario/pom.xml ./service-inventario/
COPY service-prediccion-alertas/pom.xml ./service-prediccion-alertas/
COPY service-traslados/pom.xml ./service-traslados/

RUN mvn dependency:go-offline -B -pl service-auth -am

# Copiar codigo fuente
COPY shared-kernel/src ./shared-kernel/src
COPY service-auth/src ./service-auth/src

# Compilar microservicio
RUN mvn clean package -DskipTests -pl service-auth -am

# Etapa 2: Imagen ligera de ejecucion JRE
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/service-auth/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]

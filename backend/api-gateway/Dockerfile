# Dockerfile para api-gateway (Spring Cloud Gateway)
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

RUN mvn dependency:go-offline -B -pl api-gateway -am

# Copiar codigo fuente
COPY shared-kernel/src ./shared-kernel/src
COPY api-gateway/src ./api-gateway/src

# Compilar microservicio
RUN mvn clean package -DskipTests -pl api-gateway -am

# Etapa 2: Imagen ligera de ejecucion JRE
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/api-gateway/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]

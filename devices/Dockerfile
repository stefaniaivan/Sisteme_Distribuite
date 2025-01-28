# Faza de build
FROM maven:3.8.3-openjdk-17 AS builder

# Setează directorul de lucru și copiază fișierele necesare
WORKDIR /root
COPY ./pom.xml ./
COPY ./src ./src

# Rulează Maven pentru a construi aplicația fără teste (să fie mai rapid)
RUN mvn package -DskipTests

# Faza de runtime
FROM openjdk:17-jdk-slim-buster

# Copiază fișierul JAR generat de Maven din faza de build
COPY --from=builder /root/target/*.jar app.jar

# Setează variabilele de mediu
ENV DB_IP=localhost \
    DB_PORT=3306 \
    DB_USER=root \
    DB_PASSWORD=tutorial0 \
    DB_DBNAME=device-db

# Setează comanda de pornire a aplicației
ENTRYPOINT ["java", "-jar", "/app.jar"]

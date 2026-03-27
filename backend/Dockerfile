FROM gradle:9.1-jdk26-alpine AS build
WORKDIR /app

COPY . .
RUN gradle bootJar --no-daemon

FROM eclipse-temurin:26-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar /app/app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

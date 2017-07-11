FROM mysql:8.0.0

RUN mkdir -p /config
WORKDIR /config
COPY .docker/mysql-scripts ./scripts
RUN chmod +rx scripts/*.sh
RUN mkdir migration
COPY db.sql ./migration/

EXPOSE 3306

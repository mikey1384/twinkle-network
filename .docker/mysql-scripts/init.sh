#!/bin/bash

/config/scripts/createdb.sh

/config/scripts/migratedb.sh /config/migration/db.sql

#!/bin/bash

EXPECTED_ARGS=1
E_BADARGS=65
MYSQL=`which mysql`


if [ $# -ne $EXPECTED_ARGS ]
then
  echo "Usage: $0 file"
  exit $E_BADARGS
fi

$MYSQL -uroot --password="$MYSQL_ROOT_PASSWORD"  $MYSQL_DB < $1

mysql_container_id=`docker ps | grep twinkle_mysql | cut -f 1 -d " "`
docker exec -it $mysql_container_id scripts/init.sh

#!/bin/sh

BACKEND_IP=${BACKEND_IP:-BACKEND}
BACKEND_PORT=${BACKEND_PORT:-60080}
LISTEN_PORT=${LISTEN_PORT:-80}

cp /tmp/default.conf /tmp/mid.conf

sed -i "s/\${{BACKEND_IP}}/${BACKEND_IP}/g" /tmp/mid.conf 
sed -i "s/\${{BACKEND_PORT}}/${BACKEND_PORT}/g" /tmp/mid.conf
sed -i "s/\${{LISTEN_PORT}}/${LISTEN_PORT}/g" /tmp/mid.conf

cat /tmp/mid.conf > /etc/nginx/conf.d/default.conf

exec "$@"
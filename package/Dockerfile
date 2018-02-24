FROM nginx
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
COPY dist /usr/share/nginx/html/
ADD default.conf /tmp
ADD startup.sh /
ENV BACKEND_IP=127.0.0.1 BACKEND_PORT=60080
EXPOSE 80
ENTRYPOINT [ "/bin/bash","/startup.sh" ]
CMD [ "nginx","-g","daemon off;" ]
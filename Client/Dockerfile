#FROM ubuntu/apache2

#COPY . /var/www/html

#EXPOSE 80 

#deployment

FROM nginx:alpine

COPY .  /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx" ,"-g", "daemon off;"]
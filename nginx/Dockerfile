FROM nginx:1.27-alpine

# Remove default configuration and stdout/stderr log symlinks
RUN rm -f /etc/nginx/conf.d/default.conf /var/log/nginx/access.log /var/log/nginx/error.log

# Copy custom configurations
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

# Copy SSL certificates
COPY ssl/ /etc/nginx/ssl/

# Set proper permissions
RUN chmod 600 /etc/nginx/ssl/jobboard.key && \
    chmod 644 /etc/nginx/ssl/jobboard.crt

EXPOSE 80 443 8080

CMD ["nginx", "-g", "daemon off;"]

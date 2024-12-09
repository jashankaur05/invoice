### STAGE 1: BUILD ###
FROM node:22-alpine AS build
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install Angular CLI globally and app dependencies
RUN npm install -g @angular/cli \
    && npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Angular application in production mode
RUN ng build --configuration production

### STAGE 2: RUN ###
FROM nginx:latest AS ngi

# Copy the built Angular application from the previous stage to the Nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the Nginx configuration file
COPY /nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx (this is the default command for the Nginx image)
CMD ["nginx", "-g", "daemon off;"]

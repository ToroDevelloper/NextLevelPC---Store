FROM node:18-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .
# Exponer puerto
EXPOSE 8080

# Comando para ejecutar en desarrollo
CMD ["npm", "run", "dev"]

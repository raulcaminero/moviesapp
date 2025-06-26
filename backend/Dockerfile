FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main.js"]

ENV TYPEORM_HOST=db
ENV TYPEORM_PORT=5432
ENV TYPEORM_USERNAME=movies_user
ENV TYPEORM_PASSWORD=admin123
ENV TYPEORM_DATABASE=movies_db
ENV TYPEORM_SYNCHRONIZE=true
ENV API_SECRET=3f8b2e1c-9d4a-4e2b-8c2e-7f1a2b3c4d5e

## Docker: Build and Run Everything

# From your project root, run:
# 
# ```bash
# docker-compose up --build
# ```
# 
# - The database will be available at `localhost:5432`.
# - The backend API will be available at `localhost:3001`.
# 
# ### (Optional) Seed the Database
# 
# You can run the seed script manually inside the backend container:
# 
# ```bash
# docker-compose exec backend npm run seed
# ```
# 
# You now have Docker support for both backend and database!
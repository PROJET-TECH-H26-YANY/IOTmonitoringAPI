# présenation
Auteur : *Yany Boudedja* / Cours : IOT 
Ce projet constitue l'API Backend et le service IoT pour la gestion automatisée de l'assiduité dans les laboratoires. Il sert de pont entre les objets connectés (ESP32) et l'interface de gestion des professeurs.
## setup le serveur
```
apt update && apt upgrade -y
apt install curl wget git unzip -y

adduser deploy
usermod -aG sudo deploy

curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install nodejs -y


sudo apt install mariadb-server mariadb-client -y

```
-MariaDB Config

```sql
CREATE DATABASE IotMonitoring CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'deploy'@'localhost' IDENTIFIED BY '1';

GRANT ALL PRIVILEGES ON IotMonitoring.* TO 'deploy'@'localhost';

FLUSH PRIVILEGES;
EXIT; 
```

## Initialisation & Installation
```
# 1. Initialiser le package.json
npm init -y

# 2. Installer les dépendances de PROD
npm install express mysql2 drizzle-orm mqtt dotenv cors

# 3. Installer les dépendances de DEV (TypeScript + Drizzle Kit)
npm install -D typescript ts-node nodemon drizzle-kit @types/node @types/express @types/cors
``` 

## Configuration Environment (.env)
- Crée un fichier .env à la racine :

```
PORT=3000
# Database
DB_HOST=localhost
DB_USER=ton_utilisateur
DB_PASS=ton_mot_de_passe
DB_NAME=smart_attendance_db


```
# configurer 
- lancer la migration 
``` 
npm run db:push
```
- lancer le serveur
```
npm run dev
```

# Structure du Projet
```
Backend/
├── drizzle/                # Fichiers générés par Drizzle Kit
├── src/
│   ├── config/             # Config DB & MQTT
│   ├── controllers/        # Logique des requêtes HTTP
│   ├── db/                 # Schéma des tables (schema.ts)
│   ├── repositories/       # Interactions avec la BDD
│   ├── routes/             # Définition des URLs
│   ├── services/           # Logique métier (MQTT Worker)
│   └── app.ts              # Point d'entrée
├── .env                    # Variables d'environnement
├── drizzle.config.ts       # Config de l'ORM
└── package.json
```

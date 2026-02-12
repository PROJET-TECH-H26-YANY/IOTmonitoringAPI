# présenation
Auteur : *Yany Boudedja* / Cours : IOT 
Ce projet constitue l'API Backend et le service IoT pour la gestion automatisée de l'assiduité dans les laboratoires. Il sert de pont entre les objets connectés (ESP32) et l'interface de gestion des professeurs.

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
DB_USER=root
DB_PASS=ton_mot_de_passe
DB_NAME=smart_attendance_db

# MQTT (Public pour test ou ton VPS)
MQTT_BROKER_URL=mqtt://test.mosquitto.org

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

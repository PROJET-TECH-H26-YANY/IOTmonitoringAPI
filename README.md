# présenation
Auteur : *Yany Boudedja* / Cours : IOT 
Ce projet constitue l'API Backend et le service IoT pour la gestion automatisée de l'assiduité dans les laboratoires. Il sert de pont entre les objets connectés (ESP32) et l'interface de gestion des professeurs.
## setup le serveur
```bash
apt update && apt upgrade -y
apt install curl wget git unzip -y

adduser deploy
usermod -aG sudo deploy

curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install nodejs -y


sudo apt install mariadb-server mariadb-client -y
sudo apt install nginx mosquitto mosquitto-clients -y

```
## Installation de Node-RED
Node-RED est utilisé pour la gestion des flux IoT. Installez-le globalement via npm :

```bash
sudo npm install -g --unsafe-perm node-red

# Démarrer Node-RED en arrière-plan avec PM2 (recommandé)
sudo npm install -g pm2
pm2 start node-red --name "node-red-iot"
```
*Node-RED sera accessible sur le port `1880` (ex: `http://localhost:1880`).*
-**MariaDB** Config

```sql
CREATE DATABASE IotMonitoring CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'deploy'@'localhost' IDENTIFIED BY '1';

GRANT ALL PRIVILEGES ON IotMonitoring.* TO 'deploy'@'localhost';

FLUSH PRIVILEGES;
EXIT; 
```
Le script est dans le fichier init_db.sql
## Initialisation & Installation
```
git clone https://github.com/PROJET-TECH-H26-YANY/API_IOTmonitoring.git
cd backend

# 2. Installer les dépendances
npm install
``` 

## Configuration Environment (.env)
- Crée un fichier .env à la racine :

```
PORT=3000
# Database
DB_HOST=localhost
DB_USER=ton_utilisateur
DB_PASS=ton_mot_de_passe
DB_NAME=IotMonitoring
MQTT_URL= ip_service


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

# ngix 
- crée le fichier 
```sudo nano /etc/nginx/sites-available/iotmonitoring```
- Configuration de Mosquitto
```bash
# Configuration du serveur MQTT pour l'ESP32
sudo nano /etc/mosquitto/conf.d/default.conf

# Ajouter ces deux lignes dans le fichier :
listener 1883
allow_anonymous true

# Redémarrer Mosquitto
sudo systemctl restart mosquitto
```
**Attention** : changer les variables avec les votres
- le domaine

```bash
server {
    listen 80;
    server_name api.iot.y-any.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
# Commandes d'installation et de sécurisation
**Attention** : changer les variables avec les votres
- le domaine
```bash
# 1. Activer la configuration Nginx et redémarrer
sudo ln -s /etc/nginx/sites-available/iotmonitoring /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 2. Installer Certbot pour Nginx
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# 3. Lancer Certbot (il modifiera automatiquement le fichier Nginx pour le HTTPS)
sudo certbot --nginx -d api.iot.y-any.org
```

# Maintenir le serveur en vie
``` 
sudo npm install -g pm2
npm run build
pm2 start dist/app.js --name "api-iot"
```

# Configuration du Broker MQTT
Pour permettre la communication entre l'API, Node-RED et les objets connectés (ESP32) :
1. Éditez le fichier de configuration de Mosquitto :
```bash
sudo nano /etc/mosquitto/conf.d/default.conf
# Ajoutez ces lignes pour écouter sur le port standard et autoriser les connexions :
listener 1883
allow_anonymous true
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

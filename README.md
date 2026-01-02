<a href="#">
	<picture>
		<source media="(prefers-color-scheme: dark)" srcset=".github/assets/banner_dark.png">
		<img src=".github/assets/banner.png" alt="SmashRecap - You Smash year in review" />
	</picture>
</a>

## Déploiement

L'application peut être déployée en utilisant Docker Compose. Pour ce faire, vous devez avoir Docker et Docker Compose installés sur votre système.

1. Clonez le dépôt
   ```
   git clone https://github.com/pnsgg/smashrecap.git
   ```
2. Déplacez-vous dans le répertoire du projet
   ```
   cd smash-recap
   ```
3. Créer le fichier .env à partir du fichier .env.prod.example
   ```
   cp .env.example .env
   ```
4. Rendez-vous sur [start.gg](https://start.gg) => `Developer Settings` => `OAuth Applications` => `Create OAuth Client`
 - Fill in the required fields and create the OAuth client
 - Copy the `Client ID`, `Client secret` and `Application Authorization Callback` into the .env file
4. Lancer les conteneurs docker
   ```
   docker-compose up -d --build
   ```
4. Visitez l'application à l'adresse http://localhost:3001

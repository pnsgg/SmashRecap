<a href="#">
	<picture>
		<source media="(prefers-color-scheme: dark)" srcset=".github/assets/banner_dark.png">
		<img src=".github/assets/banner.png" alt="SmashRecap - You Smash year in review" />
	</picture>
</a>

## Description

SmashRecap est une application qui génère une vidéo récapitulative personnalisée de votre année compétitive sur Super Smash Bros. Ultimate, en utilisant les données de start.gg.

## Développement Local

Pour lancer le projet localement :

1. Assurez-vous d'avoir [Bun](https://bun.sh/) installé.
2. Installez les dépendances :
   ```bash
   bun install
   ```
3. Configurez vos variables d'environnement (voir section Déploiement pour l'API start.gg).
4. Lancez le serveur de développement :
   ```bash
   bun run dev
   ```
   ou pour lancer Remotion Studio :
   ```bash
   bun run remotion:studio
   ```

## Déploiement

L'application peut être déployée en utilisant Docker Compose. Pour ce faire, vous devez avoir Docker et Docker Compose installés sur votre système.

1. Clonez le dépôt
   ```
   git clone https://github.com/pnsgg/smashrecap.git
   ```
2. Déplacez-vous dans le répertoire du projet
   ```
   cd smashrecap
   ```
3. Créer le fichier .env à partir du fichier .env.example
   ```
   cp .env.example .env
   ```
4. Rendez-vous sur [start.gg](https://start.gg) => `Developer Settings` => `OAuth Applications` => `Create OAuth Client`

- Remplissez les champs requis et créez l'application OAuth
- Copiez le `client id`, `client secret` et l'`Application Authorization Callback` dans le fichier .env

5. Rendez-vous sur [remotion.dev/docs/lambda/setup](https://www.remotion.dev/docs/lambda/setup) pour mettre en place votre Lambda avec AWS.

6. Lancer les conteneurs docker
   ```
   docker compose up
   ```
7. Visitez l'application à l'adresse http://localhost:3001

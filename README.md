# Kiwui's scripts

This package provides scripts for kiwui projects developpement and deployment.

## Developpement

To run a developpment server, simply use :

```bash
npm run dev
```

This will oen http://localhost:3000 with your browser to see the result.

## Deployment

To deploy your application, you first have to build it :

```bash
npm run build
```

Then, you can either use that static build directly with a web server like NGINX,
or you can use this command to start a production server :

```bash
npm run start
```
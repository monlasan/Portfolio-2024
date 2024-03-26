---
title: 'Différence entre la mise en cache côté client et la mise en cache côté serveur + exemple ExpressJS, Redis, MongoDB'
description: 'Apprenez la différence entre la mise en cache côté client et la mise en cache côté serveur avec un exemple de mise en cache côté serveur utilisant Redis et MongoDB à travers un serveur NodeJS.'
pubDate: 'Jan 15 2022'
heroImage: '/blog/difference-client-server-caching.jpg'
---

La mise en cache côté client et la mise en cache côté serveur sont deux façons différentes de mettre en œuvre la mise en cache dans un système. La principale différence entre les deux réside dans l'endroit où le cache est stocké et dans la personne responsable de sa gestion.

La mise en cache côté client, également connue sous le nom de mise en cache du navigateur, est réalisée lorsque le cache est stocké sur l'appareil du client, généralement dans la mémoire du navigateur ou sur le disque dur du client. Ce type de mise en cache est généralement géré par le navigateur et est contrôlé par des en-têtes envoyés par le serveur avec chaque réponse. Ces en-têtes peuvent spécifier la durée pendant laquelle le navigateur doit mettre la réponse en cache, et le navigateur utilisera cette information pour déterminer quand récupérer une nouvelle copie de la réponse auprès du serveur.

La mise en cache côté serveur, quant à elle, se fait lorsque le cache est stocké sur le serveur. Ce type de mise en cache est généralement géré par l'application côté serveur ou par un serveur de mise en cache distinct. L'application côté serveur est responsable du stockage des données dans le cache et du contrôle de la durée de la mise en cache. La mise en cache côté serveur peut se faire de différentes manières, mais la plus courante consiste à utiliser des caches en mémoire comme Memcached ou Redis. Dans ce cas, l'application côté serveur communique avec le serveur de mise en cache pour vérifier si les données existent et, si ce n'est pas le cas, elle les récupère à partir de la source d'origine, comme la base de données, et les stocke dans le cache.

La mise en cache côté client et la mise en cache côté serveur peuvent toutes deux être utiles pour améliorer les performances d'un système, mais elles présentent des forces et des faiblesses différentes.

### Mise en cache côté client

La mise en cache côté client peut être utile pour réduire le nombre de requêtes à adresser au serveur, ce qui permet d'économiser de la bande passante et de réduire la charge du serveur. Cependant, elle peut être moins fiable que la mise en cache côté serveur, car le navigateur du client n'implémente pas toujours la mise en cache correctement ou peut choisir d'ignorer les en-têtes du cache.

### Mise en cache côté serveur

La mise en cache côté serveur, en revanche, est plus fiable et permet de mieux contrôler la manière dont les données sont mises en cache. Mais elle nécessite également une infrastructure de mise en cache et une communication supplémentaire entre l'application et le serveur de mise en cache.

En général, la mise en cache côté serveur est souvent préférée pour les systèmes plus complexes ou critiques qui nécessitent un degré de contrôle plus élevé sur le processus de mise en cache, tandis que la mise en cache côté client est souvent utilisée pour compléter la mise en cache côté serveur et améliorer les performances côté client.

---

Voici un exemple de code de backend ExpressJS qui utilise MongoDB pour stocker les données et Redis pour gérer la mise en cache. Cet exemple utilise la bibliothèque mongoose pour interagir avec MongoDB et la bibliothèque redis pour interagir avec Redis.

```js
const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');

const app = express();

// Se connecter à MongoDB
mongoose.connect('mongodb://localhost/mydb', { useNewUrlParser: true });

// Se connecter à Redis
const redisClient = redis.createClient();
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Définir un modèle MongoDB pour la donnée
const DataModel = mongoose.model('Data', {
  name: String,
  value: String,
});

// Middleware pour gérer le caching
app.use((req, res, next) => {
  const key = req.originalUrl; // Utilisé l'url comme clé de cache
  redisClient.get(key, (err, data) => {
    if (err) throw err;
    if (data) {
      // Si la donnée est dans le cache, la retourner
      res.json(JSON.parse(data));
    } else {
      // Si la donnée n'est pas dans le cache, la récupérer depuis MongoDB
      DataModel.findOne({ name: req.query.name }, (err, data) => {
        if (err) throw err;
        // Stocker la donnée dans le cache pour 1 heure
        redisClient.set(key, JSON.stringify(data), 'EX', 3600);
        res.json(data);
      });
    }
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
```

Ce code met en place un serveur ExpressJS qui utilise MongoDB comme magasin de données principal et Redis comme couche de mise en cache. Il définit un modèle Mongoose DataModel qui représente les données de la collection MongoDB. Il met également en place une fonction d'intergiciel qui intercepte toutes les demandes et vérifie la présence des données dans le cache Redis. Si les données sont trouvées dans le cache, elles sont renvoyées au client, sinon elles sont extraites de MongoDB et stockées dans le cache pendant une heure.

Dans cet exemple, la clé du cache est l'URL d'origine de la requête, ce qui permet de mettre en cache la réponse pour chaque requête unique, mais vous pouvez également utiliser d'autres clés uniques comme un identifiant, un jeton ou même des paramètres de requête.
Il convient de noter qu'il ne s'agit que d'un exemple et qu'il y a beaucoup d'autres choses à prendre en compte lors de la construction d'une application prête pour la production, comme la gestion des erreurs, la sécurité, la mise à l'échelle, et bien plus encore. En outre, les données et le délai d'attente dans le cache doivent également être invalidés en fonction des exigences de l'application et des cas d'utilisation.

Voilà, vous connaissez maintenant la différence entre la mise en cache côté client et la mise en cache côté serveur et vous avez un exemple de mise en cache côté serveur utilisant Redis et MongoDB.

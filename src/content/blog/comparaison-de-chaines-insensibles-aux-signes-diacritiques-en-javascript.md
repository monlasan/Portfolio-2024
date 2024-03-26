---
title: 'Comparaison de chaînes insensibles aux signes diacritiques en JavaScript'
description: 'Découvrez comment rendre les comparaisons de chaînes insensibles aux signes diacritiques en JavaScript, optimisant ainsi la logique de vos applications avec des techniques efficaces et des bonnes pratiques.'
pubDate: 'Jan 01 2024'
heroImage: '/blog/diacritics-hero-img.jpg'
---

Dans le monde du développement web, la gestion et la manipulation des données textuelles est une tâche cruciale. Les chaînes de caractères, qui constituent le principal type de données pour le contenu textuel dans les langages de programmation tels que JavaScript et TypeScript, sont dotées d'une multitude de méthodes pour un traitement efficace des données textuelles. Toutefois, lorsqu'il s'agit de traiter des caractères Unicode qui se situent en dehors de la plage ASCII, cette tâche peut s'avérer nettement plus difficile.

Unicode est une norme universelle de codage des caractères. Il englobe pratiquement tous les caractères de tous les systèmes d'écriture utilisés aujourd'hui. Si cette représentation étendue est l'un des atouts d'Unicode, elle pose également des défis uniques aux développeurs. Par exemple, différentes séquences de caractères Unicode peuvent représenter le même caractère visuel ou le même ensemble de caractères. Cette variation peut entraîner des incohérences et des difficultés dans le traitement du texte au sein des applications web.

Une tâche particulière où ces défis deviennent évidents est le filtrage d'un tableau d'objets en fonction des entrées de l'utilisateur. Dans cet article, nous allons nous pencher sur ce scénario spécifique et explorer comment effectuer des comparaisons de chaînes insensibles aux signes diacritiques en JavaScript.

Si le filtrage d'un tableau d'objets sur la base d'une valeur de chaîne peut sembler une tâche simple à première vue, elle peut s'avérer assez complexe, en particulier lorsqu'il s'agit de caractères Unicode et d'assurer la cohérence entre les différents systèmes d'écriture. À la fin de cet article, vous aurez une meilleure compréhension de la manière d'aborder ces complexités dans vos projets JavaScript ou TypeScript.

### Filtrer un tableau d'objets en Javascript

Considérons un exemple pratique dans lequel nous avons une liste d'options d'aéroport pour un composant `Select` dans une application web. Notre objectif est de filtrer ces options en fonction des données de l'utilisateur avant de remplir le composant `Select`.

```js
const filter = 'Cancun';
const airports = [
  {
    name: 'Húsavík Airport',
    code: 'HZK',
  },
  {
    name: 'Cancún International Airport',
    code: 'CUN',
  },
  {
    name: "Côte d'Azur Airport",
    code: 'NCE',
  },
  {
    name: 'Fès-Saïs Airport',
    code: 'FEZ',
  },
];
```

L'approche initiale pour filtrer la liste des aéroports sur la base de la chaîne de filtrage pourrait être la suivante :

```js
const filteredOptions = airports.filter((option) => {
  return option.name.toLowerCase().includes(filter.toLowerCase());
});
```

Cependant, lorsque nous exécutons ce code, nous constatons que `filteredOptions` produit un tableau vide. Cela est dû au fait que les chaînes "Cancun" et "Cancún" ne sont pas considérées comme équivalentes en raison de leurs compositions de caractères différentes. JavaScript effectue des comparaisons de chaînes sur la base des valeurs de caractères Unicode et prend en compte les signes [diacritiques](https://fr.wikipedia.org/wiki/Diacritique).

Pour résoudre ce problème, nous devons utiliser la méthode [String.prototype.normalize](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize).

### Comprendre la méthode String.prototype.normalize method en Javascript

La méthode `String.prototype.normalize` est un outil puissant pour gérer les chaînes Unicode en JavaScript. Elle fait partie intégrante de la spécification [ECMAScript Internationalization API](https://402.ecma-international.org/1.0/) (ECMA-402), qui permet de comparer des chaînes en fonction de la langue, de formater des nombres ainsi que des dates et des heures.

La méthode `normalize` convertit une chaîne de caractères en une forme de normalisation Unicode spécifique. La syntaxe de cette méthode est `str.normalize([form])`, où `form` peut prendre l'une des quatre valeurs suivantes : "NFC", "NFD", "NFKC" ou "NFKD".

Mais que signifient ces formes ? Les formes de normalisation Unicode établissent des équivalences standard entre les séquences Unicode. NFC est l'acronyme de `Normalization Form C`, qui désigne la composition canonique, tandis que NFD est l'acronyme de `Normalization Form D`, qui représente la décomposition canonique. Par ailleurs, "NFKC" et "NFKD" représentent respectivement la composition et la décomposition de la compatibilité.

En termes plus simples, ces formes combinent ou décomposent des caractères qui peuvent être représentés de plusieurs manières dans Unicode.

Illustrons cela par un exemple. Prenons le caractère "é". Unicode peut le représenter soit comme un caractère unique (U+00E9, ou "é"), soit comme une combinaison de "e" et d'un accent aigu (U+0065 U+0301, ou "é"). Bien qu'elles soient visuellement identiques, ces représentations peuvent créer des incohérences dans la comparaison et la manipulation des chaînes de caractères. La méthode `normalize` permet de convertir ces différentes représentations en une forme uniforme, ce qui garantit des opérations plus fiables sur les chaînes de caractères.

### Implémenter la normalisation des chaînes de caractères

Après avoir compris la méthode `String.prototype.normalize`, voyons comment nous pouvons l'intégrer dans notre fonction. Cela nous permettra d'effectuer des comparaisons de chaînes insensibles aux signes diacritiques de manière efficace, en prenant en compte les caractères avec signes diacritiques.

```js
const normalizeString = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

const filteredOptions = airports.filter((option) => {
  return normalizeString(option.name).includes(normalizeString(filter));
});
```

La fonction commence par appeler `str.normalize('NFD')`. Cela transforme la chaîne d'entrée en sa forme de décomposition canonique, "NFD". Dans cette forme, les caractères composés tels que "é" sont décomposés en leurs caractères de base et leurs marques de combinaison, "e" et ''', respectivement.

Ensuite, la fonction utilise `.replace(/[\u0300-\u036f]/g, '')` pour supprimer toutes les marques diacritiques de la chaîne. L'expression régulière `/[\u0300-\u036f]/g` correspond à toutes les marques diacritiques combinées dans la plage Unicode de U+0300 à U+036f, ce qui inclut les accents comme l'accent aigu dans "é". En remplaçant ces marques par une chaîne vide, la fonction les supprime effectivement.

Enfin, la fonction appelle `.toLowerCase()`, qui transforme tous les caractères majuscules de la chaîne en leurs équivalents minuscules. La fonction n'est donc pas sensible à la casse, ce qui signifie qu'elle traitera "A" et "a" comme le même caractère.

La transformation des chaînes de caractères en une forme cohérente, insensible à la casse et exempte de signes diacritiques permet une comparaison et une manipulation plus fiables des chaînes de caractères.

Désormais, les options filtrées `filteredOptions` contiendront correctement l'option `Cancún`. Un autre cas d'utilisation courant de cette fonctionnalité est la gestion des données saisies par l'utilisateur dans les champs de formulaire. Lorsqu'un utilisateur saisit du texte, il est courant de normaliser la saisie avant de la traiter afin d'en assurer la cohérence. Cela est particulièrement utile dans les champs de formulaire qui acceptent des entrées internationales, où les utilisateurs peuvent saisir du texte avec une variété de signes diacritiques. Nous pourrions également appliquer une approche similaire au tri d'un tableau d'objets.

### Considérations et limites

Bien que la méthode `String.prototype.normalize` et la fonction `normalizeString` soient des outils puissants, il est important de comprendre leurs limites et leurs impacts potentiels sur les performances.

Tout d'abord, le processus de normalisation peut avoir un impact significatif sur les performances s'il est utilisé de manière excessive ou sur des chaînes de grande taille. La méthode de normalisation transforme la chaîne entière, ce qui peut s'avérer une opération coûteuse pour les chaînes de grande taille ou les appels fréquents. Il est donc important d'utiliser cette méthode de manière judicieuse et uniquement lorsque cela est nécessaire.

En outre, tous les caractères Unicode ne sont pas gérés correctement par la méthode `normalize`. La norme Unicode continue d'évoluer et certains caractères ou combinaisons peuvent ne pas être normalisés comme prévu. Il est essentiel de tester et de valider le comportement de la normalisation avec les caractères Unicode spécifiques utilisés dans votre application.

### Conclusion

La manipulation des caractères Unicode en JavaScript et TypeScript présente des défis uniques, en particulier lorsqu'il s'agit de comparaisons de chaînes insensibles aux signes diacritiques. La méthode `String.prototype.normalize`, ainsi que la fonction `normalizeString` présentée dans cet article, constituent une approche efficace pour relever ces défis. Elles transforment les chaînes de caractères en une forme cohérente, insensible à la casse et exempte de signes diacritiques, ce qui permet une comparaison et une manipulation plus fiables des chaînes de caractères. Ceci est particulièrement bénéfique pour des tâches telles que le filtrage d'éléments dans un tableau, ce qui est une exigence commune dans de nombreuses applications. Toutefois, les développeurs doivent être conscients des implications potentielles de la normalisation des chaînes en termes de performances et de ses limites avec certains caractères Unicode. La suppression des signes diacritiques, bien qu'utile pour les comparaisons, n'est pas toujours exacte ou appropriée d'un point de vue linguistique. Comme toujours, la compréhension des outils à votre disposition et de leurs limites éventuelles est essentielle pour écrire un code robuste et efficace.

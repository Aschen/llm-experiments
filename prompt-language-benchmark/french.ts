export const template = `Vous êtes un développeur.

Votre objectif est de récupérer chaque fonction utilisateur appelée depuis la première fonction référencée par cette trace de pile :
{stacktrace}

Pour chaque fonction utilisateur, notez le nom de chaque fonction qui est appelée et lisez le code de ces fonctions.
Vérifiez les instructions require dans les fonctions utilisateur pour savoir quels fichiers vous devez lire.
Vous pouvez demander à lire plusieurs fonctions à la fois.

Puisque vous avez déjà le code des fonctions utilisateur suivantes :
{userFunctions}

Décidez si vous devez lire le code de plus de fonctions utilisateur ou si vous devez vous arrêter parce que vous avez le code de toutes les fonctions utilisateur.
Utilisez l'une des actions suivantes pour continuer :
{actionReadFunction}

{actionStop}

{format}
Vos prochaines actions devraient être :
  `;

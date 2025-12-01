/**
 * Déclarations de modules pour les fichiers d'images
 * 
 * Permet à TypeScript de reconnaître les imports de fichiers d'images
 * comme des modules valides, résolvant les erreurs TS2307.
 * 
 * Utilisé par :
 * - ActivityCard.tsx : imports de Task.png, Board.png, Portal.png
 */

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.jpeg' {
  const value: any;
  export default value;
}

declare module '*.webp' {
  const value: any;
  export default value;
}



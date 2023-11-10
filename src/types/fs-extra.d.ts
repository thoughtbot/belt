import 'fs-extra';

/* eslint-disable import/prefer-default-export */
declare module 'fs-extra' {
  export const mockTemplates: () => void;
}

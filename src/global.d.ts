// react-three-fiber.d.ts
import { Object3D } from 'three';
import { Ref } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      primitive: {
        object: Object3D;
        ref?: Ref<Object3D>;
        [key: string]: any; 
      };
       group: {
        ref?: Ref<Object3D>;
        [key: string]: any; 
      };
      directionalLight:{
         [key: string]: any; 
      }
    }
  }
}

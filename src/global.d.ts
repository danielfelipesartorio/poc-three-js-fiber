// react-three-fiber.d.ts
import { Object3D } from 'three';
import { Ref } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      primitive: {
        object: Object3D;
        ref?: Ref<Object3D>;
        [key: string]: any; // Allow other props like 'dispose', 'visible', etc.
      };
    }
  }
}

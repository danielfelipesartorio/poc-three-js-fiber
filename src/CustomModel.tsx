import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { Group, Object3D, Mesh } from 'three';

type Vec3 = {
  x: number;
  y: number;
  z: number;
};

export type VariationType = { name: string, url: string }

export type ModelType = {
  name: string,
  modelUrl: string,
  modelNodes?: string[],
  variation?: VariationType[]
}

type Props = {
  readonly model: ModelType;
  readonly length: Vec3;
  readonly color: string;
  readonly variation?: string;
};

export default function CustomModel({ model, length, color, variation }: Props) {
  const modelRef = useGLTF(model.modelUrl);
  const variationRef = useGLTF(variation ?? 'Cube.glb');
  const customModelRef = useRef<Group>(null);

  const replaceEye = (name: string) => {
    const modelObject = customModelRef.current;
    if (!modelObject) return;
    const socket: Object3D = modelObject.getObjectByName(name) || modelObject;

    while (socket.children.length > 0) {
      socket.remove(socket.children[0]);
    }

    const eyeMesh = variationRef.scene.clone();
    socket.add(eyeMesh);
  };

  useEffect(() => {
    const fishObject = customModelRef.current;
    if (!fishObject) return;
    model.modelNodes?.forEach(element => {
      replaceEye(element);
    });

    // Apply scale
    fishObject.scale.set(length.x, length.y, length.z);

    // Apply color to all meshes
    fishObject.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        if (mesh.material && 'color' in mesh.material) {
          (mesh.material.color as any).set(color);
        }
      }
    });


  }, [model, length, color, variationRef.scene]);

  return <primitive ref={customModelRef} object={modelRef.scene} />;
}

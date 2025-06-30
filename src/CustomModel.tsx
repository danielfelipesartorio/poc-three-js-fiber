import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { Group, Object3D, Mesh, Vector3 } from 'three';

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
  const variationGroupRef = useRef<Group>(null);

  const replaceVariation = (name: string) => {
    const modelScene = modelRef.scene;
    const variationGroup = variationGroupRef.current;
    if (!modelScene || !variationGroup) return;

    const node = modelScene.getObjectByName(name);
    if (!node) return;

    const existing = variationGroup.getObjectByName(name);
    if (existing) variationGroup.remove(existing);

    const variation = variationRef.scene.clone();
    variation.name = name;

    node.updateWorldMatrix(true, false);

    node.getWorldPosition(variation.position);
    node.getWorldQuaternion(variation.quaternion);

    variation.scale.copy(node.scale);

    variation.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        if (mesh.material && 'color' in mesh.material) {
          (mesh.material.color as any).set('#fff');
        }
      }
    });

    variationGroup.add(variation);
  };


  useEffect(() => {
    if (!customModelRef.current || !variationGroupRef.current) return;

    customModelRef.current.scale.set(length.x, length.y, length.z);

    customModelRef.current.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        if (mesh.material && 'color' in mesh.material) {
          (mesh.material.color as any).set(color);
        }
      }
    });

    model.modelNodes?.forEach(replaceVariation);
  }, [model, length, color, variationRef.scene]);

  return (
    <>
      <primitive ref={customModelRef} object={modelRef.scene} />
      <group ref={variationGroupRef} />
    </>
  );
}

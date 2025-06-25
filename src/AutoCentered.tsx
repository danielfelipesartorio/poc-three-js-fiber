import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Box3, OrthographicCamera, Vector3 } from 'three';
import { OrbitControls } from '@react-three/drei';
import { ModelType } from './CustomModel';

export default function AutoCentered({ children, model }: {
    children: React.ReactNode, readonly model: ModelType;
}) {
    const { camera, size, scene } = useThree();

    useEffect(() => {

        const box = new Box3().setFromObject(scene);
        const center = new Vector3();
        const sizeVec = new Vector3();
        box.getCenter(center);
        box.getSize(sizeVec);

        const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z);

        const aspect = size.width / size.height;
        const frustumSize = maxDim * 1.5;

        const orthoCam = camera as OrthographicCamera;
        orthoCam.left = (-frustumSize * aspect) / 2;
        orthoCam.right = (frustumSize * aspect) / 2;
        orthoCam.top = frustumSize / 2;
        orthoCam.bottom = -frustumSize / 2;
        orthoCam.near = -1000;
        orthoCam.far = 1000;
        orthoCam.updateProjectionMatrix();

        // Move camera to isometric angle
        orthoCam.position.set(5, 5, 5);
        orthoCam.lookAt(center);
    }, [camera, scene, model]);

    return (
        <>
            <OrbitControls enableDamping />
            {children}
        </>
    );
}

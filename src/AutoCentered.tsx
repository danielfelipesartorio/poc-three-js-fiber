import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Box3, OrthographicCamera, Vector3, Group } from 'three';
import { OrbitControls } from '@react-three/drei';
import { ModelType } from './CustomModel';

export default function AutoCentered({
    children,
    model,
}: {
    children: React.ReactNode;
    readonly model: ModelType;
}) {
    const { camera, size } = useThree();
    const wrapperRef = useRef<Group>(null);

    useEffect(() => {
        const group = wrapperRef.current;
        if (!group) return;

        // Calculate bounding box
        const box = new Box3().setFromObject(group);
        const center = new Vector3();
        const sizeVec = new Vector3();
        box.getCenter(center);
        box.getSize(sizeVec);

        // Shift group to center it at origin
        // modificação temporaria apenas para adequar ao modelo que nao esta na origem
        if (Math.abs(center.z) > 2) {
            group.position.sub(center);
        }

        // Camera fit
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

        // Move camera to isometric position and look at origin
        orthoCam.position.set(-5, 5, 5);
        orthoCam.lookAt(0, 0, 0);
    }, [camera, size, model]);

    return (
        <>
            <OrbitControls enableDamping />
            <group ref={wrapperRef}>{children}</group>
        </>
    );
}

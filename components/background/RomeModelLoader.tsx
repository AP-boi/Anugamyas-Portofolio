'use client';

import React, { useMemo, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { OBJLoader, MTLLoader } from 'three-stdlib';
import * as THREE from 'three';

interface RomeModelProps {
  onLoaded?: () => void;
}

export const RomeModelLoader: React.FC<RomeModelProps> = ({ onLoaded }) => {
  // Load materials from MTL file first with texture resource path set to /rome/
  const materials = useLoader(MTLLoader, '/rome/Rome.mtl', (loader) => {
    loader.setResourcePath('/rome/');
  });

  // Preload materials and load OBJ geometry with materials assigned
  const obj = useLoader(OBJLoader, '/rome/Rome.obj', (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  // Prepare and normalize object geometry, bounding box, materials and shadows
  const processedScene = useMemo(() => {
    if (!obj) return null;
    const cloned = obj.clone(true);

    // Compute bounding box across the entire Roman scenery scene
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = maxDim > 0 ? 35 / maxDim : 0.1;

    // Center the geometry around (0,0,0)
    cloned.position.x = -center.x * scaleFactor;
    cloned.position.y = -center.y * scaleFactor;
    cloned.position.z = -center.z * scaleFactor;
    cloned.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Traverse all child meshes to enhance material properties, textures, and lighting response
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && child.visible) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const materialsArr = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materialsArr.forEach((mat) => {
            mat.side = THREE.DoubleSide;

            if (
              mat instanceof THREE.MeshPhongMaterial ||
              mat instanceof THREE.MeshStandardMaterial ||
              mat instanceof THREE.MeshLambertMaterial
            ) {
              if (mat.color.r === 0 && mat.color.g === 0 && mat.color.b === 0) {
                mat.color.setHex(0xffffff);
              }
              if (mat.map) {
                mat.map.colorSpace = THREE.SRGBColorSpace;
                mat.map.needsUpdate = true;
              }
              // Handle transparency for statues texture
              if (mat.name && mat.name.toLowerCase().includes('statue')) {
                mat.transparent = true;
                mat.alphaTest = 0.2;
              }
            }
          });
        }
      }
    });

    return { scene: cloned, center, size, scaleFactor };
  }, [obj]);

  useEffect(() => {
    if (processedScene && onLoaded) {
      onLoaded();
    }
  }, [processedScene, onLoaded]);

  if (!processedScene) return null;

  return (
    <group position={[0, -0.5, 0]} rotation={[0.02, -0.05, 0]}>
      <primitive object={processedScene.scene} />
    </group>
  );
};

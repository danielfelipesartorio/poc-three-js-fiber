import React, { Suspense, useState, ChangeEvent, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, RandomizedLight, Bounds } from '@react-three/drei';
import CustomModel, { ModelType } from './CustomModel';
import AutoCentered from './AutoCentered';

type Vec3 = {
  x: number;
  y: number;
  z: number;
};

const modelList: ModelType[] = [
  {
    name: 'Fish',
    modelUrl: '/fish/BarramundiFish.gltf',
    modelNodes: ['Eye_L', 'Eye_R'],
    variation: [{ name: 'Cube', url: 'Cube.glb' }, { name: 'Fish', url: 'BarramundiFish.glb' }]
  },
  {
    name: 'Cube',
    modelUrl: 'Cube.glb',
  },
]

export default function App() {
  const [length, setLength] = useState<Vec3>({ x: 1, y: 1, z: 1 });
  const [color, setColor] = useState<string>('#ffffff');
  const [modelDetails, setModelDetails] = useState(modelList[0])
  const [variation, setVariation] = useState<string | undefined>(modelDetails.variation?.[0].url);

  const handleLengthChange = (axis: keyof Vec3) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setLength(prev => ({ ...prev, [axis]: value }));
    }
  };

  const handleModelChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const selected = modelList.find(model => model.name === e.target.value)!
    setModelDetails(selected)
    setVariation(selected.variation?.[0].url)
  }, [])

  const handleClick = useCallback(() => {
    alert(
      "Cor: " + color + " " +
      "Tamanho: " + JSON.stringify(length) + " " +
      "Variação: " + variation
    )
  }, [color, length, variation])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '95vh' }}>
      <div style={{ width: '100%', backgroundColor: 'lightblue' }}>
        <label>
          Modelo
          <br />
          <select value={modelDetails.name} onChange={handleModelChange}>
            {modelList.map(i => {
              return (<option key={i.name} value={i.name}>{i.name}</option>)
            })}
          </select>
        </label>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }} >
        <div >
          <label>
            Fish Length
            <br />
            <input type="text" value={length.x} onChange={handleLengthChange('x')} />
            <input type="range" min="0.5" max="2" step="0.1" value={length.x} onChange={handleLengthChange('x')} />
            <br />
            <input type="text" value={length.y} onChange={handleLengthChange('y')} />
            <input type="range" min="0.5" max="2" step="0.1" value={length.y} onChange={handleLengthChange('y')} />
            <br />
            <input type="text" value={length.z} onChange={handleLengthChange('z')} />
            <input type="range" min="0.5" max="2" step="0.1" value={length.z} onChange={handleLengthChange('z')} />
          </label>
          <br />
          <label>
            Cor
            <br />
            <input type="color" value={color} onChange={(e: ChangeEvent<HTMLInputElement>) => setColor(e.target.value)} />
          </label>
          <br />
          {
            modelDetails.variation ? (
              <label>
                Variação
                <br />
                <select value={variation} onChange={(e: ChangeEvent<HTMLSelectElement>) => setVariation(e.target.value)}>
                  {modelDetails.variation?.map(i => {
                    return (<option key={i.name} value={i.url}>{i.name}</option>)
                  })}
                </select>
              </label>
            ) : undefined
          }

        </div>

        <Canvas orthographic>
          <RandomizedLight castShadow amount={8} frames={100} position={[5, 5, 5]} />
          <RandomizedLight castShadow amount={8} frames={100} position={[-5, -5, -5]} />
          <Suspense fallback={null}>
            <Environment preset="sunset" />
            <AutoCentered model={modelDetails}>
              <CustomModel model={modelDetails} length={length} color={color} variation={variation} />
            </AutoCentered>
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
      <div style={{ width: '100%', backgroundColor: 'lightblue', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <button onClick={handleClick}>
          Confirmar customização
        </button>
      </div>
    </div >
  );
}

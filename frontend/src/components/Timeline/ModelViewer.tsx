import { OrbitControls } from "@react-three/drei";
import React, { Suspense, useRef } from "react";
import { Canvas, useFrame, useLoader } from "react-three-fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export interface IModelViewerProps {}
export const ModelViewer: React.FunctionComponent<IModelViewerProps> = (
  props
) => {
  return (
    <div
      style={{
        height: "200px",
      }}
    >
      <Canvas>
        <OrbitControls />
        <directionalLight intensity={0.5} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.9} />
        <Suspense fallback={<Loading />}>
          <Sphere />
        </Suspense>
      </Canvas>
    </div>
  );
};

function Sphere() {
  return (
    <mesh rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[1, 16, 16]} />
      <meshStandardMaterial attach="material" color="blue" />
    </mesh>
  );
}

// function Table() {
//   // textures from the imported image
//   const texture = useLoader(THREE.TextureLoader, img);
//   const texture1 = useLoader(THREE.TextureLoader, img1);
//   const texture2 = useLoader(THREE.TextureLoader, img2);
//   const group = useRef();
//   // loading the table.gtlf file being imported into the component.
//   const { nodes } = useLoader(GLTFLoader, table);
//   // useFrame will run outside of react in animation frames to optimize updates.
//   useFrame(() => {
//     group.current.rotation.x = 5.09;
//   });
//   return (
//     // Add a ref to the group. This gives us a hook to manipulate the properties of this geometry in the useFrame callback.
//     <group ref={group} position={[-12, -20, -10]}>
//       <mesh visible geometry={nodes.mesh_1.geometry}>
//         <meshPhongMaterial
//           attach="material"
//           color="gold"
//           map={texture}
//           map={texture1}
//           map={texture2}
//         />
//       </mesh>
//       <mesh visible geometry={nodes.mesh_0.geometry}>
//         <meshPhongMaterial
//           attach="material"
//           color="#795C34"
//           map={texture}
//           map={texture1}
//           map={texture2}
//         />
//       </mesh>
//     </group>
//   );
// }

function Loading() {
  return (
    <mesh rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[1, 16, 16]} />
      <meshStandardMaterial
        attach="material"
        color="white"
        transparent
        opacity={0.6}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

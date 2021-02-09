import React from "react";
import * as THREE from "three";

/**
 * A component encapsulating the THREE powered spotiverse engine
 *
 * Bootstrapped from: https://blog.bitsrc.io/starting-with-react-16-and-three-js-in-5-minutes-3079b8829817
 * Converted into a FC
 *
 * @param props n/a
 */
export const ThreeEngine: React.FC = (props) => {
  const rootRef = React.useRef(undefined);
  React.useEffect(() => {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    rootRef.current.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    camera.position.z = 5;

    var animate = function () {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <div ref={rootRef} />;
};

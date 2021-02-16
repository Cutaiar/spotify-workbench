import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Particle } from "./Particle";
import { AxisHelper } from "./axis";
import { Song } from "../../models/song";
import { generateTestLocalSongs } from "./helpers";

const SIMULATION_SCALE: number = 100;

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
    // let canvas: HTMLCanvasElement;
    let light: THREE.AmbientLight;

    let particles: Particle[];
    // let raycaster: THREE.Raycaster;
    // let mouse: THREE.Vector2;

    let particleGroup: THREE.Object3D;

    // let frameId: number = null;

    let controls: OrbitControls;

    let SIMULATION_SCALE: number = 100;
    // let dragging: boolean = false;
    // let offset: THREE.Vector3;
    let plane: THREE.Mesh;
    // let lerpVec: THREE.Vector3;

    let axisFeatures = new Map<string, string>([
      ["x", "speechiness"],
      ["y", "acousticness"],
      ["z", "valence"],
    ]);

    let cachedSongs: Song[];

    // let lastSelectedParticle: Particle;
    // let currentSelectedParticle: Particle;

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

    // soft white light
    light = new THREE.AmbientLight(0x404040);
    light.position.z = 10;
    scene.add(light);

    // camera controller
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 2;
    //this.controls.update(); //controls.update() must be called after any manual changes to the camera's transform

    const onSongsChanged = (newSongs: Song[]) => {
      console.log("onSongsChanged");
      cachedSongs = newSongs;
      smartRegenerateSongParticleRelations();
    };

    const addParticle = (particle: Particle) => {
      particles.push(particle);
      particleGroup.add(particle.mesh);
    };

    // cached songs should be updated before calling this function
    const smartRegenerateSongParticleRelations = () => {
      let c = 0;
      // Reassign current particles new songs
      for (let p of particles) {
        p.song = cachedSongs[c];
        //p.color = s.color(255, 0, 0) // Debug colors
        c++;
        if (c === cachedSongs.length) {
          break; // If there are less new songs than points
        }
      }

      // There are more new songs than points
      if (c < cachedSongs.length) {
        // console.log("Smart Regenerate: adding new songs...")
        for (let i = c; i < cachedSongs.length; i++) {
          let n = new Particle(
            1,
            Array(3).fill(SIMULATION_SCALE / 2),
            cachedSongs[i]
          );
          //n.color = new THREE.Color(0,255,0) // Debug colors
          addParticle(n);
        }
      } else {
        // Fade out any remaining particles
        // console.log("Smart Regenerate: removing old songs...")
        let toRemove = new Array<Particle>();
        for (let i = c; i < particles.length; i++) {
          let p = particles[i];
          toRemove.push(p);
          p.intendedSize = 0;
        }

        // wait half a second for any deleted particles to fade out, then delete
        setTimeout(() => {
          particles = particles.slice(0, c);
          toRemove.forEach((p) => particleGroup.remove(p.mesh));
        }, 500);
      }
      regenerateTargetsAccordingToSongs();
    };

    const regenerateTargetsAccordingToSongs = () => {
      // TODO scale values if necessary [0,1]

      const scaleValues = (values: any[], min: any, max: any) => {
        return values.map((v) => scaleValue(v, min, max));
      };

      const scaleValue = (value: number, min: number, max: number) => {
        return value / (max - min);
      };

      const scalingConstants: Map<string, any> = new Map<string, any>()
        .set("key", { min: 0, max: 11 })
        .set("loudness", { min: 60, max: 0 })
        .set("tempo", { min: 0, max: 250 })
        .set("popularity", { min: 0, max: 100 }); // TODO: Verify these values

      //let a map hold the values for x, y, z that will be scaled to fit our graph
      let scaledValues = new Map<string, Array<number>>();

      new Array<string>("x", "y", "z").forEach((element) => {
        let feature = axisFeatures.get(element);
        //Feature does not need scaling
        if (!scalingConstants.get(feature)) {
          let unscaled_vals: any[] = [];
          particles.forEach((p) =>
            unscaled_vals.push(p.song.features[feature])
          );
          scaledValues.set(element, unscaled_vals);
        }
        // Feature needs scaling bc its scaling values are defined
        else {
          let unscaled_vals: any[] = [];
          particles.forEach((p) => {
            unscaled_vals.push(p.song.features[axisFeatures.get(element)]);
          });
          // console.log(appService.scalingConstants.get(feature).min, appService.scalingConstants.get(feature).max);
          scaledValues.set(
            element,
            scaleValues(
              unscaled_vals,
              scalingConstants.get(feature).min,
              scalingConstants.get(feature).max
            )
          );
        }
      });

      //at this point, our map holds all of the scales values that we want :))))))
      let count = 0;
      particles.forEach((p) => {
        p.intendedLoc = new THREE.Vector3(
          scaledValues.get("x")[count],
          scaledValues.get("y")[count],
          scaledValues.get("z")[count]
        ).multiplyScalar(SIMULATION_SCALE);
        count++;
      });
      count = 0;
      particles.forEach((p) => {
        p.loc = new THREE.Vector3(
          scaledValues.get("x")[count],
          scaledValues.get("y")[count],
          scaledValues.get("z")[count]
        ).multiplyScalar(SIMULATION_SCALE);
        count++;
      });
    };

    const regenerateTargetsToCenterForLoading = () => {
      let pad = SIMULATION_SCALE * 0.1;
      let center = SIMULATION_SCALE / 2;
      particles.forEach((p) => {
        p.intendedLoc = new THREE.Vector3(
          center + Math.random() * pad,
          center + Math.random() * pad,
          center + Math.random() * pad
        );
      });
    };

    const regenerateTargetsRandomly = (effectSize = false): void => {
      let mul = 100;
      particles.forEach((p) => {
        p.intendedLoc.x = Math.random() * mul;
        p.intendedLoc.y = Math.random() * mul;
        p.intendedLoc.z = Math.random() * mul;
        if (effectSize) p.intendedSize = Math.random() * 3 + 0.5;
      });
    };

    window.addEventListener(
      "keydown",
      function (this: Window, ev: KeyboardEvent) {
        if (ev.key === "r") {
          regenerateTargetsRandomly();
        }
      }
    );

    const generateAxisAndGrid = () => {
      let gridHelper = new THREE.GridHelper(
        SIMULATION_SCALE * 2,
        50,
        0xffffff,
        0xffffff
      );
      let mat: any = gridHelper.material;
      mat.transparent = true;
      mat.opacity = 0.1;
      scene.add(gridHelper);
      gridHelper.position.setY(-1); // To not clip with meshlines

      // let axisHelper = new AxisHelper(
      //   SIMULATION_SCALE,
      //   1,
      //   true,
      //   false,
      //   true,
      //   true
      // );
      // scene.add(axisHelper.object3d);
    };
    generateAxisAndGrid();

    // Particle setup
    particleGroup = new THREE.Object3D();
    scene.add(particleGroup);
    plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1000, 1000, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    // offset = new THREE.Vector3();
    // lerpVec = new THREE.Vector3();
    plane.visible = false;
    // this.plane.material.opacity = .1;
    scene.add(plane);
    particles = [];

    camera.position.z = 5;

    var animate = function () {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      controls.update(); // required if controls.enableDamping or controls.autoRotate are set to true
      particles.forEach((p) => {
        p.update();
      });
      renderer.render(scene, camera);
    };

    const testSongs = generateTestLocalSongs();
    onSongsChanged(testSongs);

    animate();
  }, []);

  return <div ref={rootRef} />;
};
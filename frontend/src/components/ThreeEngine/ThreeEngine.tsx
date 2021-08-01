import React, { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Particle } from "./Particle";
import { AxisHelper } from "./axis";
import { Song } from "../../models/song";
import { generateRandomSongs } from "../../spotifyDataAccess";
import { render } from "@testing-library/react";
import { BufferGeometry } from "three";
import { MeshLine, MeshLineMaterial } from "three.meshline";


const SIMULATION_SCALE: number = 100;

enum Axis {
  X, Y, Z
}


const makeAxis = (color: string | number | THREE.Color, axis: Axis, includeNegative: boolean) => {
  const material = new THREE.LineBasicMaterial({
    color: color,
    opacity: 1,
    transparent: true,
    linewidth: 1
  });
  const points = [];
  switch (axis) {
    case Axis.X:
      points.push(new THREE.Vector3(SIMULATION_SCALE, 0, 0));
      points.push(new THREE.Vector3(includeNegative ? -SIMULATION_SCALE : 0, 0, 0));
      break;
    case Axis.Y:
      points.push(new THREE.Vector3(0, SIMULATION_SCALE, 0));
      points.push(new THREE.Vector3(0, includeNegative ? -SIMULATION_SCALE : 0, 0));
      break;
    case Axis.Z:
      points.push(new THREE.Vector3(0, 0, SIMULATION_SCALE));
      points.push(new THREE.Vector3(0, 0, includeNegative ? -SIMULATION_SCALE : 0));
      break;
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.Line(geometry, material);
}

// TODO this might cause extra rerenders, consider encapsulating song[] in interface
export interface IThreeEngineProps {
  songs: Song[];
  setSong: (song: Song) => void;
  song: Song;
  axisChange: string;
}
/**
 * A component encapsulating the THREE powered spotiverse engine
 *
 * Bootstrapped from: https://blog.bitsrc.io/starting-with-react-16-and-th
ree-js-in-5-minutes-3079b8829817
 * Converted into a FC
 *
 * TODO there is way too much going on in the useeffect, move as much out of it as you can
 * @param props the songs to render in the particle system
 */
export const ThreeEngine: React.FC<IThreeEngineProps> = (props) => {
  const rootRef = React.useRef(undefined);
  const controls = useRef((ev: any) => { })
  const [lastParticle, setLastParticle] = useState<Particle>();
  const mouse = useRef<THREE.Vector2>(new THREE.Vector2(0, 0))
  const { songs, setSong, song, axisChange } = props;
  // const [selectedParticles, setSelectedParticles] = useState<Particle[]>([]); //this should be a queue that would be so much easier but im lazy
  const [particles, setParticles] = useState([])
  const [currentSelectedParticle, setCurrentSelectedParticle] = useState<Particle>()

  useEffect(() => {
    console.log(axisChange)
    //this is where you will shine andrew
    // in this use effect you will implement the logic that shall update the particles
    // god speed good sir
  }, [axisChange])

  useEffect(() => {
    const particle = particles.find(p => p.song === song)
    if (particle) {
      setLastParticle(currentSelectedParticle);
      setCurrentSelectedParticle(particle)
      particle.select()
    }
  }, [song])

  useEffect(() => {
    if (lastParticle) {
      lastParticle?.deselect()
    }
  }, [lastParticle])

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    let particleGroup = new THREE.Object3D(); //should be moved to state
    // let canvas: HTMLCanvasElement;

    // let raycaster: THREE.Raycaster;
    const raycaster = new THREE.Raycaster();

    const selectParticle = (ev: any) => {
      ev.preventDefault()
      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2();
      mouse.x = (ev.clientX / renderer.domElement.clientWidth) * 2 - 1;

      //NOTE: I believe we need to add the radius of the particles but am not sure, adding 20 kinda works
      mouse.y = - ((ev.clientY - renderer.domElement.offsetTop + 20) / renderer.domElement.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      var intersects = raycaster.intersectObjects([particleGroup], true);
      if (intersects.length > 0) {
        var intersection: any = (intersects.length) > 0 ? intersects[0] : null;
        if (intersection != null) {
          const p: Particle = intersection.object.userData.particle
          p.select()
          setSong(p.song)
          //not sure what below does but leaving it commented so I don't lose it 
          //     // this.controls.enabled = false;
          //     // let planeIntersection = this.raycaster.intersectObject(this.plane);
          //     // // this.offset.copy(planeIntersection[0].point).sub(this.plane.osition)
          //     // this.lerpVec.copy(p.intendedLoc)

        }


      }
    }
    controls.current = selectParticle


    // let mouse: THREE.Vector2;


    // let frameId: number = null;


    // let dragging: boolean = false;
    // let offset: THREE.Vector3;
    // let lerpVec: THREE.Vector3;

    // let songs: Song[] = [];

    const axisFeatures = new Map<string, string>([
      ["x", "speechiness"],
      ["y", "acousticness"],
      ["z", "valence"],
    ]);

    // let lastSelectedParticle: Particle;
    // let currentSelectedParticle: Particle;

    // setup scene and camera

    // setup renderer
    var renderer = new THREE.WebGLRenderer() //.setSize(window.innerWidth / 10 * 7, window.innerHeight / 100 * 87);
    renderer.setSize(window.innerWidth / 10 * 7, window.innerHeight / 100 * 87);
    rootRef.current.appendChild(renderer.domElement);


    // soft white light
    const light = new THREE.AmbientLight(0x404040);
    light.position.z = 10;
    scene.add(light);

    // setup camera controller
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    orbitControls.dampingFactor = 0.05;
    orbitControls.screenSpacePanning = false;
    orbitControls.minDistance = 100;
    orbitControls.maxDistance = 500;
    orbitControls.maxPolarAngle = Math.PI / 2;
    //this.controls.update(); //controls.update() must be called after any manual changes to the camera's transform

    const addParticle = (particle: Particle) => {
      particles.push(particle);
      particleGroup.add(particle.mesh);
    };

    const smartRegenerateSongParticleRelations = ():
      | NodeJS.Timeout
      | undefined => {
      let c = 0;
      let particlesDeleteTimer: NodeJS.Timeout | undefined = undefined;
      // Reassign current particles new songs
      for (let p of particles) {
        p.song = songs[c];
        //p.color = s.color(255, 0, 0) // Debug colors
        c++;
        if (c === songs.length) {
          break; // If there are less new songs than points
        }
      }

      // There are more new songs than points
      if (c < songs.length) {
        // console.log("Smart Regenerate: adding new songs...")
        for (let i = c; i < songs.length; i++) {
          let n = new Particle(
            1,
            Array(3).fill(SIMULATION_SCALE / 2),
            songs[i]
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
        // particlesDeleteTimer = setTimeout(() => {
        //   particles = particles.slice(0, c);
        //   toRemove.forEach((p) => particleGroup.remove(p.mesh));
        // }, 500);
        //need to fix that i guess
      }
      regenerateTargetsAccordingToSongs();
      return particlesDeleteTimer;
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
      particles.forEach((p, i) => {
        p.intendedLoc = new THREE.Vector3(
          scaledValues.get("x")[i],
          scaledValues.get("y")[i],
          scaledValues.get("z")[i]
        ).multiplyScalar(SIMULATION_SCALE);
      });
      particles.forEach((p, i) => {
        p.loc = new THREE.Vector3(
          scaledValues.get("x")[i],
          scaledValues.get("y")[i],
          scaledValues.get("z")[i]
        ).multiplyScalar(SIMULATION_SCALE);
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
      const mul = 100;
      particles.forEach((p) => {
        p.intendedLoc.x = Math.random() * mul;
        p.intendedLoc.y = Math.random() * mul;
        p.intendedLoc.z = Math.random() * mul;
        if (effectSize) p.intendedSize = Math.random() * 3 + 0.5;
      });
    };

    // Have to use function syntax for some reason
    const keydownHandler = function (this: Window, ev: KeyboardEvent) {
      if (ev.key === "r") {
        regenerateTargetsRandomly();
        return;
      }
      if (ev.key === "c") {
        regenerateTargetsToCenterForLoading();
      }
    };

    window.addEventListener("keydown", keydownHandler);

    // (() => { // this is an effort to make things functional 
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



    // Particle setup
    scene.add(particleGroup);
    const plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1000, 1000, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    // offset = new THREE.Vector3();
    // lerpVec = new THREE.Vector3();
    plane.visible = false;
    // this.plane.material.opacity = .1;
    scene.add(plane);


    scene.add(makeAxis(0x0b933b, Axis.X, true))
    scene.add(makeAxis(0x229d9d, Axis.Y, false))
    scene.add(makeAxis(0xc7e7a1, Axis.Z, true))

    camera.position.set(120, 120, 190);


    var animate = function () {
      requestAnimationFrame(animate);
      raycaster.setFromCamera(mouse.current, camera)
      orbitControls.update(); // required if controls.enableDamping or controls.autoRotate are set to true
      particles.forEach((p) => {
        p.update();
      });
      renderer.render(scene, camera);
    };

    console.log("songs changed, regenerating...");
    console.log(songs);
    // songs = generateRandomSongs();
    const particlesDeleteTimer = smartRegenerateSongParticleRelations();
    animate();

    return () => {
      if (particlesDeleteTimer) {
        clearTimeout(particlesDeleteTimer);
      }
      window.removeEventListener("keydown", keydownHandler);
    };

  }, [songs]);

  // const handleMouseMove = (e: React.PointerEvent<HTMLDivElement>) => {
  //   // e.preventDefault()
  //   // mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
  //   // mouse.current.y = (e.clientY / window.innerHeight) * 2 + 1
  // }

  // (
  //style={{ width: "70%", background: "background: linear-gradient(to top, rgb(2, 2, 2), rgb(182, 10, 0) 20%, rgb(2, 2, 2) 100%)" }}>
  return <div onPointerDown={e => controls.current(e)}>
    <div ref={rootRef} />
  </div>;
};

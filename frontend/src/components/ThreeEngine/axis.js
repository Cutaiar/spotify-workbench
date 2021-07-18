import * as THREE from "three";
import { MeshLine, MeshLineMaterial } from "three.meshline";
import { BufferGeometry } from "three";

export class AxisHelper {
  constructor(axisLength, opacity, xNeg, yNeg, zNeg, useColor) {
    this.object3d = new THREE.Object3D();
    this.axisLength = axisLength;
    this.opacity = opacity;
    this.l = useColor ? "50%" : "100%";

    this.createAxis(
      new THREE.Vector3(xNeg ? -this.axisLength : 0, 0, 0),
      new THREE.Vector3(this.axisLength, 0, 0),
      new THREE.Color(0x0b933b),
      0.8
    );

    this.createAxis(
      new THREE.Vector3(0, yNeg ? -this.axisLength : 0, 0),
      new THREE.Vector3(0, this.axisLength, 0),
      new THREE.Color(0x229d9d),
      0.8
    );

    this.createAxis(
      new THREE.Vector3(0, 0, zNeg ? -this.axisLength : 0),
      new THREE.Vector3(0, 0, this.axisLength),
      new THREE.Color(0xc7e7a1),
      0.8
    );
  }

  createAxis(p1, p2, color, width) {
    let geometry = new BufferGeometry();
    let mat = new MeshLineMaterial({
      color: color,
      opacity: this.opacity,
      transparent: true,
      lineWidth: width,
    });

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([p1, p2]), 3)
    );

    // get a new method for axis

    let mesh = new THREE.Mesh(geometry, mat);
    this.object3d.add(mesh);
  }
}

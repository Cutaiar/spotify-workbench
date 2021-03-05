import * as THREE from "three";

export class Particle {
    loc;
    size;
    restingSize;
    intendedLoc;
    intendedSize;

    color;
    song;

    constructor(size, loc, song) {
        this.size = size;
        this.restingSize = size;
        this.loc = new THREE.Vector3(loc[0], loc[1], loc[2]); // Expects an array of size 3 [x,y,z]
        this.intendedLoc = this.loc;
        this.intendedSize = size;

        this.color = new THREE.Color(255, 255, 255); // Default Color
        this.song = song; //Todo: copy?

        this.createMesh();
    }

    isAtRest() {
        return this.intendedLoc === this.loc;
    }

    update() {
        this.internalUpdate();
    }

    internalUpdate() {
        //this.loc = this.intendedLoc;
        this.mesh.position.x = THREE.MathUtils.lerp(
            this.mesh.position.x,
            this.intendedLoc.x,
            0.1
        );
        this.mesh.position.y = THREE.MathUtils.lerp(
            this.mesh.position.y,
            this.intendedLoc.y,
            0.1
        );
        this.mesh.position.z = THREE.MathUtils.lerp(
            this.mesh.position.z,
            this.intendedLoc.z,
            0.1
        );

        this.size = THREE.MathUtils.lerp(this.size, this.intendedSize, 0.1);

        // Update mesh
        // this.mesh.position.x = this.loc.x;
        // this.mesh.position.y = this.loc.y;
        // this.mesh.position.z = this.loc.z;
        this.material.color = this.color;
        this.mesh.scale.set(this.size, this.size, this.size);
        this.mesh.geometry.verticesNeedUpdate = true;
    }

    select() {
        this.color = new THREE.Color(0x00ab6c);
        this.intendedSize = 3;
        this.material.opacity = 1; //TODO: unhardcode
    }

    deselect() {
        this.color = new THREE.Color(255, 255, 255);
        this.intendedSize = this.restingSize;
        this.material.opacity = 0.5; //TODO: unhardcode
    }


    createMesh() {
        this.geometry = new THREE.SphereGeometry(1, 16, 16);
        this.geometry.dynamic = true;
        this.material = new THREE.MeshBasicMaterial({
            color: this.color,
            transparent: true,
            depthTest: false,
            precision: "lowp",
            opacity: 0.5,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.userData = { particle: this };

        this.mesh.position.x = this.loc.x;
        this.mesh.position.y = this.loc.y;
        this.mesh.position.z = this.loc.z;

        this.mesh.scale.set(this.size, this.size, this.size);
    }
}
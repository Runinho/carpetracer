import * as THREE from 'three';

// https://de.wikipedia.org/wiki/Einspurmodell
class OneTrackCar {
  constructor(name, age, occupation) {
    // static parameter
// static parameter
    this.wheelbase = 3.28143; // m
    this.center_of_gravity_height = 0.787372; // m
    this.center_of_gravity = 1.80834; // in front of rear axle
    this.mass = 1300; // kg
    this.moment_of_inertia = 2200 // kg m^2

    // wheel
    this.front_cornering_stiffness = 75000*0.8; //
    this.rear_cornering_stiffness = 	150000*0.8; //

    // dynamic values
    this.steering_angle = 0;

    // in wiki also called x
    this.state = new THREE.Vector3(0, 0, 0); // [rotation around COG, angular acceleration around COG]
    this.velocity = 0 ; //m/s
  }

  // Method to display info
  step(angle) {
    const t = 1/60; // in s

    const front_cog = this.wheelbase - this.center_of_gravity

    if(Math.abs(this.velocity) > 0){
      const A = new THREE.Matrix3()
      A.set(
        -(this.front_cornering_stiffness * this.rear_cornering_stiffness)/(this.mass * this.velocity),
        ((this.mass * this.velocity * this.velocity) - (this.rear_cornering_stiffness * this.center_of_gravity - front_cog * this.front_cornering_stiffness)) / (this.mass * this.velocity * this.velocity),
        0,
        - (this.rear_cornering_stiffness * front_cog - this.front_cornering_stiffness * this.center_of_gravity)/this.moment_of_inertia,
        - (this.front_cornering_stiffness * this.center_of_gravity* this.center_of_gravity + this.front_cornering_stiffness * front_cog * front_cog)/(this.moment_of_inertia * this.velocity),
        0,
        0,
        0,
        0,
        )

      const B = new THREE.Vector3(
        this.front_cornering_stiffness/(this.mass * this.velocity),
        (this.front_cornering_stiffness * front_cog)/this.moment_of_inertia,
        0,
      )

      const tmp = B.multiplyScalar(angle)
      console.log(tmp)
      console.log(this.state, A, B, tmp, angle)

      this.state.applyMatrix3(A).add(tmp)
    }
  }
}

export default OneTrackCar
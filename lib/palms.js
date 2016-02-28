import { FINGERS, REACH_KEYS, EFFORTS, DISTANCES } from "./config";

export default class Palms {
  constructor() {
    this.reset();

    this.prevKeyname = "";
    this.prevFinger  = "";
    this.prevShift   = "";
  }

  moveTo(keyname, shift) {
    const finger          = FINGERS[keyname] || "";
    const return_overhead = this.returnOverhead(keyname, finger);
    const shift_overhead  = this.shiftOverhead(finger, shift);

    const effort   = return_overhead.effort   + shift_overhead.effort;
    const distance = return_overhead.distance + shift_overhead.distance;

    this[finger] += 1;

    return { distance, effort };
  }

  returnOverhead(keyname, finger) {
    let effort   = 0;
    let distance = 0;

    const same_finger = finger === this.prevFinger;
    const same_hand   = finger[0] === this.prevFinger[0] || finger[0] === this.prevShift[0];
    const reached_out = same_hand && REACH_KEYS.indexOf(this.prevKeyname) !== -1;

    // adding a cost of the same finger movement or moving a hand from a reaching out position
    if (keyname !== this.prevKeyname && (same_finger || reached_out)) {
      // counting the retraction effort as a half of the original effort
      effort   += ~~(EFFORTS[this.prevKeyname] / 2);
      distance += ~~(DISTANCES[this.prevKeyname] / 2);
    }

    this.prevFinger  = finger;
    this.prevKeyname = keyname;

    return { distance, effort };
  }

  shiftOverhead(finger, shift) {
    let effort   = 0;
    let distance = 0;

    const shift_name = shift && this.shiftName(finger);

    if (shift_name) {
      if (this.prevShift !== shift_name) {
        effort   += EFFORTS[shift_name];
        distance += DISTANCES[shift_name];

        this.prevShift = shift_name;
      }
    } else {
      this.prevShift = "";
    }

    return { distance, effort };
  }

  shiftName(finger) {
    return finger[0] === "r" ? "l-shift" : "r-shift";
  }

  reset() {
    for (let keyname in FINGERS) {
      const finger = FINGERS[keyname];

      if (this[finger] === undefined) {
        this[finger] = 0;
      }
    }
  }
}
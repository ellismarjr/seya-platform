import { Clock } from "./Clock";

export class RealClock implements Clock {
  getDate(): Date {
    return new Date();
  }

}
export class TimeSlots {

    date: string;
  startTime: string;
  endTime: string;
  repeated: boolean;
  repeatOption: string;

  constructor(date: string, startTime: string, endTime: string, repeated: boolean, repeatOption: string) {
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.repeated = repeated;
    this.repeatOption = repeatOption;
  }
}

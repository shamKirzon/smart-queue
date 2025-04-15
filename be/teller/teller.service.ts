export class TellerService {
  // object for storing counters status
  private counterStatus: Record<string, "active" | "inactive"> = {
    counter1: "inactive",
    counter2: "inactive",
    counter3: "inactive",
    counter4: "inactive",
    countera1: "inactive",
    counterp1: "inactive",
  };

  getStatus(): Record<string, "active" | "inactive"> {
    return this.counterStatus;
  }

  setCounterStatus(counterId: string, status: "active" | "inactive") {
    counterId = counterId.replace(" ", "").toLowerCase();

    if (this.counterStatus[counterId] !== status) {
      this.counterStatus[counterId] = status;
    }
  }

  resetCounterStatus() {
    Object.keys(this.counterStatus).forEach((key)=>{
        this.counterStatus[key] = "inactive"
    })
  }
}

class Logger {
  static on = true;

  static debug(...args) {
    if (this.on) {
      console.debug(...args);
    }
  }

  static log(...args) {
    if (this.on) {
      console.log(...args);
    }
  }
}

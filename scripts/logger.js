class Logger {
  static on = true;

  static debug(...args) {
    if (this.on) {
      console.debug(args);
    }
  }

  static info(...args) {
    if (this.on) {
      console.info(args);
    }
  }
}

// tslint:disable no-console no-any
import colors from 'colors';

class Logger {
  debug(...args: any) {
    console.error(
      colors.blue('Debug |'),
      ...args
    );
  }

  error(...args: any) {
    console.error(
      colors.red('Error |'),
      ...args
    );
  }

  info(...args: any) {
    console.info(
      colors.grey('Info |'),
      ...args
    );
  }

  warn(...args: any) {
    console.warn(
      'WARNING - ',
      ...args
    );
  }
};

const logger = new Logger()

export default logger;
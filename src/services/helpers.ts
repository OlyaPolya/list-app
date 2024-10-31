export function throttle<T>(callback: (args: T) => void, delay: number): (args: T) => void {
  let timer: NodeJS.Timeout | null = null;
  return function perform(...args): void {
    if (timer) {
      return;
    }

    timer = setTimeout(() => {
      callback(...args);
      clearTimeout(timer!);
      timer = null;
    }, delay);
  };
}

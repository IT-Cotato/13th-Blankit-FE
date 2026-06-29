export function applyServiceWorkerUpdate(registration?: ServiceWorkerRegistration) {
    const waitingWorker = registration?.waiting;
    if (!waitingWorker) {
      return false;
    }
  
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    return true;
  }
  
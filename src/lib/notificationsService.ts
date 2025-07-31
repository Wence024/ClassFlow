// This file will manage the state and logic for our global notification system.

// The list of functions that are listening for new messages.
let listeners: ((msg: string) => void)[] = [];

/**
 * The imperative function to be called from anywhere in the app to display a message.
 * It iterates through all subscribed listeners and calls them with the message.
 * @param msg The message to display.
 */
export function showNotification(msg: string) {
  listeners.forEach((listener) => listener(msg));
}

/**
 * A function for the Notification component to subscribe to new messages.
 * @param newListener The function to be called when a new message is sent.
 * @returns An `unsubscribe` function to be used for cleanup.
 */
export function subscribe(newListener: (msg: string) => void): () => void {
  listeners.push(newListener);

  // Return a cleanup function that removes the listener from the array.
  return () => {
    listeners = listeners.filter((listener) => listener !== newListener);
  };
}

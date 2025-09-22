import { toast } from "sonner";

/**
 * The imperative function to be called from anywhere in the app to display a message.
 * It directly uses the toast function to display the message.
 *
 * @param msg The message to display.
 */
export function showNotification(msg: string) {
  toast(msg);
}

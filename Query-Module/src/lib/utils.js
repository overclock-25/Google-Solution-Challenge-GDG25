import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const firebaseErrorMessages = {
  // === Authentication Errors ===
  // Sign-up errors
  'auth/email-already-in-use': {
    title: "Email already in use",
    description: "This email address is already registered. Try signing in instead."
  },
  'auth/invalid-email': {
    title: "Invalid email",
    description: "Please enter a valid email address."
  },
  'auth/weak-password': {
    title: "Weak password",
    description: "Password should be at least 6 characters long."
  },
  'auth/operation-not-allowed': {
    title: "Operation not allowed",
    description: "This authentication method is not enabled for this project."
  },

  // Sign-in errors
  'auth/user-not-found': {
    title: "Account not found",
    description: "No account found with this email address. Please check your email or sign up."
  },
  'auth/wrong-password': {
    title: "Incorrect password",
    description: "The password you entered is incorrect. Please try again."
  },
  'auth/invalid-credential': {
    title: "Invalid credentials",
    description: "The provided credentials are invalid. Please try again."
  },
  'auth/user-disabled': {
    title: "Account disabled",
    description: "This account has been disabled. Please contact support."
  },
  'auth/invalid-login-credentials': {
    title: "Invalid login credentials",
    description: "The email or password you entered is incorrect. Please try again."
  },

  // === Firestore Errors ===
  'permission-denied': {
    title: "Permission denied",
    description: "You don't have permission to access this resource."
  },
  'not-found': {
    title: "Not found",
    description: "The requested document or collection does not exist."
  },
  'already-exists': {
    title: "Already exists",
    description: "The document already exists and cannot be created again."
  },
  'resource-exhausted': {
    title: "Resource exhausted",
    description: "You've reached the quota limit for this operation. Try again later."
  },
  'failed-precondition': {
    title: "Operation failed",
    description: "This operation cannot be executed in the current system state."
  },
  'aborted': {
    title: "Operation aborted",
    description: "The operation was aborted, typically due to a concurrency issue."
  },
  'out-of-range': {
    title: "Out of range",
    description: "The operation was attempted past the valid range."
  },
  'unimplemented': {
    title: "Not implemented",
    description: "This operation is not implemented or supported."
  },
  'internal': {
    title: "Internal error",
    description: "An internal error occurred. Please try again later."
  },
  'unavailable': {
    title: "Service unavailable",
    description: "The service is currently unavailable. Please try again later."
  },
  'data-loss': {
    title: "Data loss",
    description: "Unrecoverable data loss or corruption."
  },
  'unauthenticated': {
    title: "Authentication required",
    description: "You must be authenticated to perform this operation."
  },

  // === Storage Errors ===
  'storage/object-not-found': {
    title: "File not found",
    description: "The requested file does not exist."
  },
  'storage/unauthorized': {
    title: "Unauthorized",
    description: "You don't have permission to access this file."
  },
  'storage/canceled': {
    title: "Operation canceled",
    description: "The upload or download was canceled."
  },
  'storage/retry-limit-exceeded': {
    title: "Timeout",
    description: "The maximum time limit for this operation was exceeded."
  },
  'storage/invalid-checksum': {
    title: "File corrupted",
    description: "The file is corrupted. Please try uploading again."
  },
  'storage/quota-exceeded': {
    title: "Storage quota exceeded",
    description: "Storage quota has been exceeded. Please free up some space."
  },

  // === Real-time Database Errors ===
  'database/permission-denied': {
    title: "Permission denied",
    description: "You don't have permission to access this database path."
  },
  'database/disconnected': {
    title: "Disconnected",
    description: "You are disconnected from the database. Please check your connection."
  },
  'database/network-error': {
    title: "Network error",
    description: "A network error occurred. Please check your connection and try again."
  },
  'database/write-canceled': {
    title: "Write canceled",
    description: "The write operation was canceled by the server."
  },

  // === Common Network Errors ===
  'network-request-failed': {
    title: "Network error",
    description: "A network error occurred. Please check your internet connection and try again."
  },
  'timeout': {
    title: "Timeout",
    description: "The operation timed out. Please try again."
  },
  'too-many-requests': {
    title: "Too many requests",
    description: "You've made too many requests. Please try again later."
  },

  // === Generic Errors ===
  'cancelled': {
    title: "Operation cancelled",
    description: "The operation was cancelled."
  },
  'unknown': {
    title: "Unknown error",
    description: "An unknown error occurred. Please try again."
  }
};

// Usage example:
const handleFirebaseError = (error) => {
  // Extract code from error object
  const errorCode = error.code || (error.details && error.details.code) || 'unknown';
  
  // Get the error message from our mapping
  const errorInfo = firebaseErrorMessages[errorCode] || {
    title: "Operation failed",
    description: error.message || "An unexpected error occurred. Please try again."
  };
  
  return errorInfo;
};
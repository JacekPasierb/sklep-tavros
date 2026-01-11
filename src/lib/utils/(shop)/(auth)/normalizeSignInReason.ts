import {SignInReason} from "../../../../types/(shop)/(auth)/signin";

export const getSignInReasonMessage = (reason: SignInReason) => {
  if (reason === "registered") {
    return {
      tone: "success" as const,
      text: "Your account has been created. You can log in now.",
    };
  }

  if (reason === "favorites") {
    return {
      tone: "warning" as const,
      text: "Favorites require an account. Please log in to view your list.",
    };
  }

  if (reason === "myaccount") {
    return {
      tone: "warning" as const,
      text: "You need to log in to access your account.",
    };
  }

  return null;
};

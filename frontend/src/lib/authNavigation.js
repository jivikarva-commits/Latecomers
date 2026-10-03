export function quizStartPath(user) {
  if (!user) return "/signin";
  if (!user.isProfileCompleted) return "/profile-setup";
  if (!user.onboarded) return "/onboarding";
  return "/career-test";
}

export function postAuthPath(user, requestedLocation) {
  if (!user?.isProfileCompleted) return "/profile-setup";
  if (!user?.onboarded) return "/onboarding";

  const pathname = requestedLocation?.pathname;
  if (typeof pathname === "string" && pathname.startsWith("/") && !pathname.startsWith("//")) {
    return `${pathname}${requestedLocation?.search || ""}${requestedLocation?.hash || ""}`;
  }

  return "/dashboard";
}

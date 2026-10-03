import { postAuthPath, quizStartPath } from "./authNavigation";

describe("auth navigation", () => {
  test("quiz entry sends each user to the next required step", () => {
    expect(quizStartPath(null)).toBe("/signin");
    expect(quizStartPath({ onboarded: false })).toBe("/profile-setup");
    expect(quizStartPath({ isProfileCompleted: true, onboarded: false })).toBe("/onboarding");
    expect(quizStartPath({ isProfileCompleted: true, onboarded: true })).toBe("/career-test");
  });

  test("post-auth routing never skips required profile or onboarding", () => {
    const requested = { pathname: "/pricing", search: "?plan=starter_offer" };
    expect(postAuthPath({}, requested)).toBe("/profile-setup");
    expect(postAuthPath({ isProfileCompleted: true, onboarded: false }, requested)).toBe("/onboarding");
    expect(postAuthPath({ isProfileCompleted: true, onboarded: true }, requested)).toBe("/pricing?plan=starter_offer");
  });

  test("post-auth routing rejects protocol-relative return paths", () => {
    expect(postAuthPath({ isProfileCompleted: true, onboarded: true }, { pathname: "//evil.example" })).toBe("/dashboard");
  });
});

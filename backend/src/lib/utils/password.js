import { mainLogger } from "@/lib/logger/winston.js";

export const validatePassword = ({ password }, checkPassComplexity) => {
  const containsUppercase = (ch) => /[A-Z]/.test(ch);
  const containsLowercase = (ch) => /[a-z]/.test(ch);
  const containsSpecialChar = (ch) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);

  let countOfUpperCase = 0;
  let countOfLowerCase = 0;
  let countOfNumbers = 0;
  let countOfSpecialChar = 0;

  for (let i = 0; i < password.length; i++) {
    const ch = password.charAt(i);
    if (!Number.isNaN(+ch)) countOfNumbers++; 
    else if (containsUppercase(ch)) countOfUpperCase++; 
    else if (containsLowercase(ch)) countOfLowerCase++; 
    else if (containsSpecialChar(ch)) countOfSpecialChar++; 
  }

  const missingComponents = [];

  if (countOfLowerCase < 1) missingComponents.push("lowercase letter");
  if (countOfUpperCase < 1) missingComponents.push("uppercase letter");
  if (countOfNumbers < 1) missingComponents.push("number");
  if (countOfSpecialChar < 1) missingComponents.push("special character");

  if (missingComponents.length > 0) {
    const message = `Password must contain at least one ${missingComponents.join(", ")}.`;
    checkPassComplexity.addIssue({
      code: "custom",
      message,
    });
    mainLogger.error(message);
  }
};

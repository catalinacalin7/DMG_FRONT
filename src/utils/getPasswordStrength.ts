export const getPasswordStrength = (
  password: string,
  email: string,
): "weak" | "standard" | "good" | "strong" => {
  let score = 0;

  // Rule 1: At least 8 characters
  if (password.length >= 8) {
    score++;
  }

  // Rule 2: Does not contain email prefix
  const emailPrefix = email.split("@")[0].toLowerCase();
  if (!password.toLowerCase().includes(emailPrefix) && password) {
    score++;
  }

  // Rule 3: Contains at least one number or symbol
  const regex = /[0-9!@#$%^&*()_+=\-{}\[\]:;\"'<>,.?/~`|\\]/;
  if (regex.test(password)) {
    score++;
  }

  // Determine password strength based on score
  let status: "weak" | "standard" | "good" | "strong";
  switch (score) {
    case 3:
      status = "strong";
      break;
    case 2:
      status = "good";
      break;
    case 1:
      status = "standard";
      break;
    default:
      status = "weak";
  }

  return status;
};

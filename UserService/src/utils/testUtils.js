import { authService } from "../services/authService";

export const testConnection = async () => {
  try {
    // Test backend connection by trying to make a request
    const response = await fetch("http://localhost:3000/health");
    const data = await response.json();
    console.log("Backend connection test:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Backend connection failed:", error);
    return { success: false, error: error.message };
  }
};

export const testAuth = async () => {
  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  };

  const testCredentials = {
    email: "test@example.com",
    password: "password123",
  };

  try {
    console.log("Testing signup...");
    const signupResult = await authService.signup(testUser);
    console.log("Signup successful:", signupResult);

    // Clear the token to test login
    authService.logout();

    console.log("Testing login...");
    const loginResult = await authService.login(testCredentials);
    console.log("Login successful:", loginResult);

    return { success: true, signup: signupResult, login: loginResult };
  } catch (error) {
    console.error("Auth test failed:", error);
    return { success: false, error };
  }
};

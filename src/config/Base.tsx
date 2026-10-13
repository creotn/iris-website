const AppConfig = {
  isDev: process.env.NODE_ENV === "development",
  baseUrl: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
  apiUrl: process.env.API_URL || "http://localhost:5000",
};

export default AppConfig;

export const config = {
  expoMode: import.meta.env.VITE_EXPO_MODE === 'true',
  baseUrl: import.meta.env.VITE_BASE_URL || window.location.origin,
  appName: 'Dubbio',
  appDescription: 'Convert any video to any language with AI-powered voice dubbing',
};

export const isExpoMode = () => config.expoMode;

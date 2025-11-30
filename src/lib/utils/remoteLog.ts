const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

type LogLevel = 'info' | 'warn' | 'error';

async function sendLogToBackend(level: LogLevel, message: string, data?: any) {
  try {
    await fetch(`${API_URL}/logs/client`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, message, data }),
    });
  } catch (error) {
    // Silenciar errores de logging para no crear bucles
    console.error('Error enviando log al backend:', error);
  }
}

export const remoteLog = {
  info: (message: string, data?: any) => {
    console.log(`[REMOTE LOG] ${message}`, data);
    sendLogToBackend('info', message, data);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[REMOTE LOG] ${message}`, data);
    sendLogToBackend('warn', message, data);
  },
  error: (message: string, data?: any) => {
    console.error(`[REMOTE LOG] ${message}`, data);
    sendLogToBackend('error', message, data);
  },
};

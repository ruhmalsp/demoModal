import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const examplePath = resolve(process.cwd(), '.env.example');
const exampleValues = dotenv.parse(readFileSync(examplePath));
for (const [name, value] of Object.entries(exampleValues)) {
  if (!process.env[name]?.trim()) {
    process.env[name] = value;
  }
}

export type AppEnvironment = 'dev' | 'qa' | 'staging' | 'production';
export type AppProfile = 'sauce-demo' | 'generic';

export interface AppConfig {
  env: Exclude<AppEnvironment, 'production'>;
  profile: AppProfile;
  uiBaseUrl: string;
  apiBaseUrl: string;
}

function requireValue(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment setting ${name}. Configure it in .env or the CI environment.`);
  }
  return value;
}

function parseEnvironment(): AppEnvironment {
  const value = requireValue('APP_ENV').toLowerCase();
  if (!['dev', 'qa', 'staging', 'production'].includes(value)) {
    throw new Error('APP_ENV must be dev, qa, staging, or production.');
  }
  return value as AppEnvironment;
}

function validateTargetUrl(name: string, value: string): string {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${name} must be an absolute HTTPS URL.`);
  }
  if (
    parsed.protocol !== 'https:' ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash ||
    (parsed.port && parsed.port !== '443')
  ) {
    throw new Error(`${name} must use HTTPS on the standard port and contain no credentials, query, or fragment.`);
  }
  parsed.pathname = '/';
  return parsed.toString().replace(/\/$/, '');
}

export function assertSafeExecutionEnvironment(): Exclude<AppEnvironment, 'production'> {
  const environment = parseEnvironment();
  if (environment === 'production') {
    throw new Error('Production test execution is blocked.');
  }
  return environment;
}

const environment = assertSafeExecutionEnvironment();
const prefix = environment.toUpperCase();
const profile = process.env.APP_PROFILE?.trim().toLowerCase() || 'sauce-demo';
if (profile !== 'sauce-demo' && profile !== 'generic') {
  throw new Error('APP_PROFILE must be sauce-demo or generic.');
}

export const appConfig: AppConfig = {
  env: environment,
  profile,
  uiBaseUrl: validateTargetUrl(`${prefix}_UI_BASE_URL`, requireValue(`${prefix}_UI_BASE_URL`)),
  apiBaseUrl: validateTargetUrl(`${prefix}_API_BASE_URL`, requireValue(`${prefix}_API_BASE_URL`))
};

export interface DemoCredentials {
  username: string;
  password: string;
  lockedUsername: string;
}

export function getDemoCredentials(): DemoCredentials {
  return {
    username: requireCredential('USERNAME', 'SAUCE_USERNAME'),
    password: requireCredential('PASSWORD', 'SAUCE_PASSWORD'),
    lockedUsername: requireCredential('LOCKED_USERNAME', 'SAUCE_LOCKED_USERNAME')
  };
}

function requireCredential(name: string, legacyName: string): string {
  const configured = process.env[`${prefix}_${name}`]?.trim();
  return configured || requireValue(`${prefix}_${legacyName}`);
}

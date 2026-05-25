export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing environment variable "${name}". ` +
      `Copy .env.local.example to .env.local and fill in the value.`
    )
  }
  return value
}

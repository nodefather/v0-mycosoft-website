# Security Review Notes

## Scope
- Working tree scan for potential secrets (excluded `node_modules`).
- Git history scan across all commits for common secret patterns.

## Commands run
- `rg -n -S "(API_KEY|SECRET|TOKEN|PASSWORD|BEGIN RSA|BEGIN PRIVATE|AWS_|GCP_|AZURE_|ssh-rsa|PRIVATE KEY|SECRET_KEY|SLACK|WEBHOOK|ENCRYPTION|CREDENTIAL|BEARER)" --glob '!node_modules/**' --glob '!.pnpm/**' .`
- `git rev-list --all | xargs -n 50 git grep -n -I -e "temp-mock-chemspider-key-123456789" -e "BEGIN PRIVATE KEY" -e "AKIA" -e "ssh-rsa" -e "NATUREOS_API_KEY" -e "MONGODB_API_KEY" -e "AZURE_MAPS_KEY"`

## Findings
- The working tree referenced environment variables for API keys but did not include real secrets.
- Git history contained a hardcoded placeholder ChemSpider key string in `lib/services/chemical-data.ts`.

## Recommended follow-ups
- Rotate any credentials that may have been exposed historically.
- Rewrite Git history to remove the placeholder key string if you intend to fully scrub public history.

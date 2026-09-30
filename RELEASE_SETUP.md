# Android release setup

The repository includes a GitHub Actions workflow for building the app, but a real Google Play release must use a release/upload signing key.

Never commit a real keystore, password, API key, or signing secret to the repository.

The production workflow should receive these values through protected GitHub Actions secrets and create the signing configuration during the build.

Required production secrets will normally include:
- upload keystore material
- keystore password
- key password
- key alias
- DEEN_AI_ENDPOINT

The public Play Store release also needs a public privacy-policy URL and completed Google Play declarations.

#!/bin/sh

projects="\
@blockchain-lab-um/oid4vc-issuer,\
@blockchain-lab-um/oid4vc-verifier,\
@blockchain-lab-um/oidc-rp-plugin\
"

pnpm nx run-many \
  --target=build \
  --projects=$projects

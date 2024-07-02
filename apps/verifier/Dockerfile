FROM blockchain-lab-um/oid4vc-monorepo:latest as builder

FROM node:20.15.0-alpine3.16

WORKDIR /app

# Install pnpm
RUN npm i -g pnpm@9.4.0

COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/verifier/package.json ./apps/verifier/package.json
COPY --from=builder /app/apps/verifier/dist ./apps/verifier/dist

# Copy oidc-plugin
COPY --from=builder /app/libs/rp-plugin/dist ./libs/rp-plugin/dist
COPY --from=builder /app/libs/rp-plugin/package.json ./libs/rp-plugin/package.json

ENV NODE_ENV=production

# Remove prepare script
RUN npm pkg delete scripts.prepare

RUN pnpm install --frozen-lockfile

RUN chown node:node /app

USER node
CMD [ "node", "apps/verifier/dist/src/main.js" ]

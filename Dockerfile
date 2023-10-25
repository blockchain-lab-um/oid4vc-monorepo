FROM node:18.16.0-alpine3.16

WORKDIR /app

# Install pnpm
RUN npm i -g pnpm@8.6.10

# Copy patches
COPY ./patches ./patches

# Copy root package.json + pnpm-lock.yaml + pnpm-workspace.yaml
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./

##########
#  LIBS  #
##########
COPY ./libs/rp-plugin/package.json ./libs/rp-plugin/

##########
#  APPS  #
##########
COPY ./apps/issuer/package.json ./apps/issuer/
COPY ./apps/verifier/package.json ./apps/verifier/

# Remove prepare script
RUN npm pkg delete scripts.prepare

# Copy all other files
COPY . .

# Install all the dependencies
# This would be better before COPY . . but we use postinstall scripts
# that depend on some of the files copied above
RUN pnpm install --frozen-lockfile

ENV NODE_ENV=production

# Build affected projects
RUN pnpm build:docker

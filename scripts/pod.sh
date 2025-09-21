#!/usr/bin/env sh
set -eu

ENV=$1
NAME=$2

if [ -z "$ENV" ]; then
  echo "❌ No environment specified. Usage: ./pod.sh <env> [name]"
  exit 1
fi

ENV_FILE="/etc/dgrs/conexus/envs/.env.$ENV"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Environment file not found: $ENV_FILE"
  exit 1
fi

POD_NAME="${NAME}-pod-$ENV"
CONTAINER_NAME="${NAME}-container-$ENV"
IMAGE_NAME="${NAME}:$ENV"

# Cleanup
podman rm -f "$CONTAINER_NAME" 2>/dev/null || true
podman pod rm -f "$POD_NAME" 2>/dev/null || true

# Create new pod
podman pod create --name "$POD_NAME" -p "${FRONTEND_PORT:-4323}:4321"

# Run container inside pod
podman run -d \
  --name "$CONTAINER_NAME" \
  --pod "$POD_NAME" \
  "$IMAGE_NAME"

echo "✅ Pod $POD_NAME running with container $CONTAINER_NAME on port ${FRONTEND_PORT:-4323}"
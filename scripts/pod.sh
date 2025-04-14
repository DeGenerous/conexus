#!/bin/bash

# Variables
APP_NAME=conexus-v1
CONTAINER_NAME=conexus-v1-container
POD_NAME=conexus-v1-pod

# Export evnironment variables
export $(grep -v '^#' .env | xargs)

# Build the Docker image
podman build -t $APP_NAME ..

# Remove the existing container if it exists
podman rm -f $CONTAINER_NAME

# Remove the existing pod if it exists
podman pod rm -f $POD_NAME

# Create a new pod
podman pod create --name $POD_NAME -p 4323:4321

# Run the container in the pod
podman run -d --name $CONTAINER_NAME --pod $POD_NAME $APP_NAME
#!/usr/bin/env sh
set -eu

usage() {
  echo "Usage: $0 {build|restart|reload} <env>"
  exit 1
}

if [ $# -lt 2 ]; then
  usage
fi

CMD=$1
ENV=$2
NAME=conexus

build_image() {
  echo "🔨 Building $NAME image for env=$ENV..."
  podman build -t $NAME:$ENV .
}

restart_pod() {
  echo "♻️  Restarting pod for env=$ENV..."
  ./scripts/pod.sh "$ENV" "$NAME"
}

case "$CMD" in
  build)
    build_image
    ;;
  restart)
    restart_pod
    ;;
  reload)
    build_image
    restart_pod
    ;;
  *)
    usage
    ;;
esac
#!/bin/zsh
DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd -P)"
exec "$DIR/scripts/launch_workshop.sh"

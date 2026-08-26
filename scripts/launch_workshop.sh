#!/bin/zsh
set -u

APP_NAME="LedFx Workshop"
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd -P)"
PROJECT_DIR="${LEDFX_WORKSHOP_DIR:-$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd -P)}"
BIND_HOST="${LEDFX_WORKSHOP_HOST:-127.0.0.1}"
START_PORT="${LEDFX_WORKSHOP_PORT:-8057}"
LEDFX_URL="${LEDFX_API_URL:-http://127.0.0.1:8888}"
LOG_FILE="${LEDFX_WORKSHOP_LOG:-$PROJECT_DIR/ledfx-workshop.log}"
OPEN_BROWSER=1

for arg in "$@"; do
  case "$arg" in
    --no-open)
      OPEN_BROWSER=0
      ;;
  esac
done

show_alert() {
  local message="$1"
  local escaped="${message//\\/\\\\}"
  escaped="${escaped//\"/\\\"}"
  if command -v osascript >/dev/null 2>&1; then
    osascript -e "display dialog \"$escaped\" with title \"$APP_NAME\" buttons {\"OK\"} default button \"OK\"" >/dev/null 2>&1 || true
  fi
  print -r -- "$message"
}

find_python() {
  if [ -x "$PROJECT_DIR/.venv/bin/python3" ]; then
    print -r -- "$PROJECT_DIR/.venv/bin/python3"
    return 0
  fi
  if [ -x "$PROJECT_DIR/.venv/bin/python" ]; then
    print -r -- "$PROJECT_DIR/.venv/bin/python"
    return 0
  fi
  if command -v python3 >/dev/null 2>&1; then
    command -v python3
    return 0
  fi
  if command -v python >/dev/null 2>&1; then
    command -v python
    return 0
  fi
  return 1
}

open_url() {
  local url="$1"
  if [ "${LEDFX_WORKSHOP_NO_OPEN:-0}" = "1" ] || [ "$OPEN_BROWSER" -eq 0 ]; then
    print -r -- "$url"
    return 0
  fi
  if command -v open >/dev/null 2>&1; then
    open "$url" >/dev/null 2>&1 &
    return 0
  fi
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" >/dev/null 2>&1 &
    return 0
  fi
  show_alert "Open this address in your browser: $url"
}

if [ ! -d "$PROJECT_DIR/src" ]; then
  show_alert "Cannot find the Workshop project folder. Keep this launcher inside the LedFx Workshop folder."
  exit 1
fi

PYTHON_BIN="$(find_python || true)"
if [ -z "$PYTHON_BIN" ]; then
  show_alert "Python 3 was not found. Install Python 3.10 or newer, then click the launcher again."
  exit 1
fi

workshop_status() {
  "$PYTHON_BIN" - "$1" <<'PY' >/dev/null 2>&1
import json
import sys
import urllib.request

url = sys.argv[1].rstrip("/") + "/api/connection"
try:
    with urllib.request.urlopen(url, timeout=0.8) as response:
        payload = json.loads(response.read().decode("utf-8"))
    raise SystemExit(0 if isinstance(payload, dict) and "ledfx_url" in payload else 1)
except Exception:
    raise SystemExit(1)
PY
}

find_free_port() {
  "$PYTHON_BIN" - "$BIND_HOST" "$START_PORT" <<'PY'
import socket
import sys

host = sys.argv[1]
start = int(sys.argv[2])
for port in range(start, start + 80):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind((host, port))
        except OSError:
            continue
        print(port)
        raise SystemExit(0)
raise SystemExit("No free local port found.")
PY
}

EXISTING_PORT=""
if [ -f "$PROJECT_DIR/.ledfx-workshop.port" ]; then
  EXISTING_PORT="$(tr -dc '0-9' < "$PROJECT_DIR/.ledfx-workshop.port")"
fi

for candidate in "$EXISTING_PORT" "$START_PORT"; do
  if [ -n "$candidate" ]; then
    candidate_url="http://$BIND_HOST:$candidate"
    if workshop_status "$candidate_url"; then
      open_url "$candidate_url"
      exit 0
    fi
  fi
done

PORT="$(find_free_port 2>/dev/null || true)"
if [ -z "$PORT" ]; then
  show_alert "No free local port was found for $APP_NAME."
  exit 1
fi

mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null || true
{
  print ""
  print "[$(date '+%Y-%m-%d %H:%M:%S')] Starting $APP_NAME"
  print "Project: $PROJECT_DIR"
  print "Python: $PYTHON_BIN"
  print "Workshop URL: http://$BIND_HOST:$PORT"
  print "LedFx API: $LEDFX_URL"
} >> "$LOG_FILE"

cd "$PROJECT_DIR" || {
  show_alert "Cannot open project folder: $PROJECT_DIR"
  exit 1
}

nohup "$PYTHON_BIN" -m src.server --host "$BIND_HOST" --port "$PORT" --ledfx "$LEDFX_URL" >> "$LOG_FILE" 2>&1 &
SERVER_PID=$!
print -r -- "$SERVER_PID" > "$PROJECT_DIR/.ledfx-workshop.pid"
print -r -- "$PORT" > "$PROJECT_DIR/.ledfx-workshop.port"

URL="http://$BIND_HOST:$PORT"
for _attempt in {1..60}; do
  if workshop_status "$URL"; then
    open_url "$URL"
    exit 0
  fi
  if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    show_alert "$APP_NAME stopped while starting. Check the log: $LOG_FILE"
    exit 1
  fi
  sleep 0.25
done

open_url "$URL"
show_alert "$APP_NAME was started, but it did not answer yet. If the page stays blank, check the log: $LOG_FILE"

#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <token_address>"
    exit 1
fi

TOKEN_ADDRESS=$1

# Directories of the servers
PONDER_DIR="./ponderServer"
WEB_DIR="./webserver"

# Command to run both servers
PONDER_CMD="TOKEN=$TOKEN_ADDRESS npm run dev"
WEB_CMD="npm run dev"

# Log files for debugging
PONDER_LOG="ponder.log"
WEB_LOG="webserver.log"

# Health check interval (seconds)
CHECK_INTERVAL=30

# Start both servers
start_ponder() {
    echo "Starting PonderServer..."
    cd "$PONDER_DIR" || exit
    TOKEN="$TOKEN_ADDRESS" npx ponder dev >> "../$PONDER_LOG" 2>&1 &
    PONDER_PID=$!
    cd - > /dev/null
}

start_web() {
    echo "Starting WebServer..."
    cd "$WEB_DIR" || exit
    $WEB_CMD >> "../$WEB_LOG" 2>&1 &
    WEB_PID=$!
    cd - > /dev/null
}

# Initial startup
start_ponder
start_web

# Monitor function
while true; do
    sleep $CHECK_INTERVAL

    # Check if PonderServer is running
    if ! ps -p $PONDER_PID > /dev/null; then
        echo "PonderServer crashed! Restarting..."
        start_ponder
    fi

    # Check if WebServer is running
    if ! ps -p $WEB_PID > /dev/null; then
        echo "WebServer crashed! Restarting..."
        start_web
    fi
done

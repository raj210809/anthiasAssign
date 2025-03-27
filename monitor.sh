#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <token_address>"
    exit 1
fi

TOKEN_ADDRESS=$1

# Directories of the servers
PONDER_DIR="./ponderServer"
WEB_DIR="./webserver"

WEB_CMD="npm run dev"

WEB_LOG="webserver.log"

CHECK_INTERVAL=30

start_ponder() {
    echo "Starting PonderServer with TOKEN_ADDRESS=$TOKEN_ADDRESS"
    cd "$PONDER_DIR" || exit

    TOKEN="$TOKEN_ADDRESS" npx ponder dev > /dev/null 2>&1 &
    PONDER_PID=$!
    
    cd - > /dev/null
}

# Start WebServer and log to file
start_web() {
    echo "Starting WebServer..."
    cd "$WEB_DIR" || exit
    $WEB_CMD >> "../$WEB_LOG" 2>&1 &  # Log WebServer output
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
    if ! kill -0 $PONDER_PID 2>/dev/null; then
        echo "PonderServer crashed! Restarting..."
        start_ponder
    fi

    # Check if WebServer is running
    if ! kill -0 $WEB_PID 2>/dev/null; then
        echo "WebServer crashed! Restarting..."
        start_web
    fi
done

#!/bin/bash

# Function to display help
show_help() {
    echo "Usage: ./run-app.sh [local|remote] [dev|build|start]"
    echo ""
    echo "Modes:"
    echo "  local   - Use local Supabase instance (.env.local)"
    echo "  remote  - Use remote Supabase instance (.env.production)"
    echo ""
    echo "Commands:"
    echo "  dev     - Run in development mode (default)"
    echo "  build   - Build for production"
    echo "  start   - Start production server (must build first)"
    echo ""
    echo "Examples:"
    echo "  ./run-app.sh local dev"
    echo "  ./run-app.sh remote build"
}

# Default values
MODE=${1:-"local"}
CMD=${2:-"dev"}

if [[ "$1" == "--help" || "$1" == "-h" ]]; then
    show_help
    exit 0
fi

case $MODE in
    "local")
        ENV_FILE=".env.local"
        ;;
    "remote")
        ENV_FILE=".env.production"
        ;;
    *)
        echo "Error: Invalid mode '$MODE'. Use 'local' or 'remote'."
        show_help
        exit 1
        ;;
esac

echo "🚀 Starting with $MODE environment ($ENV_FILE)..."

case $CMD in
    "dev")
        npm run dev:$MODE
        ;;
    "build")
        npm run build:$MODE
        ;;
    "start")
        npm run start
        ;;
    *)
        echo "Error: Invalid command '$CMD'. Use 'dev', 'build', or 'start'."
        show_help
        exit 1
        ;;
esac

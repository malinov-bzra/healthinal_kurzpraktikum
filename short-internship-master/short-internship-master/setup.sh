#!/bin/bash

handle_error() {
  local exit_code="$?"
  exit "$exit_code"
}

trap 'handle_error' ERR

echo '
 /$$$$$$             /$$                                             /$$       /$$
|_  $$_/            | $$                                            | $$      |__/
  | $$   /$$$$$$$  /$$$$$$    /$$$$$$   /$$$$$$  /$$$$$$$   /$$$$$$$| $$$$$$$  /$$  /$$$$$$
  | $$  | $$__  $$|_  $$_/   /$$__  $$ /$$__  $$| $$__  $$ /$$_____/| $$__  $$| $$ /$$__  $$
  | $$  | $$  \ $$  | $$    | $$$$$$$$| $$  \__/| $$  \ $$|  $$$$$$ | $$  \ $$| $$| $$  \ $$
  | $$  | $$  | $$  | $$ /$$| $$_____/| $$      | $$  | $$ \____  $$| $$  | $$| $$| $$  | $$
 /$$$$$$| $$  | $$  |  $$$$/|  $$$$$$$| $$      | $$  | $$ /$$$$$$$/| $$  | $$| $$| $$$$$$$/
|______/|__/  |__/   \___/   \_______/|__/      |__/  |__/|_______/ |__/  |__/|__/| $$____/
                                                                                  | $$
                                                                                  | $$
                                                                                  |__/
'

echo "Hi there! This script will set up your development environment for short-internship."
read -p "ℹ️ Press Enter to continue..."
echo

echo "⚙️ Installing Java SDK"
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk env install
echo

echo "⚙️ Installing Node.js"
source "$HOME/.nvm/nvm.sh"
nvm install
echo

echo "ℹ️ setup frontend"
echo

pushd ./frontend > /dev/null || exit

echo "➤ Enabling Corepack (for Yarn)"
corepack enable
echo

echo "➤ Installing Yarn dependencies"
yarn install
echo

popd > /dev/null || exit

echo "🎉 Setup complete, happy hacking!"
echo

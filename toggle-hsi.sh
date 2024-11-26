#!/bin/bash

# Function to backup original files
backup_files() {
    echo "Backing up package.json and tsconfig.json"
    if [ -f "tsconfig.json.bak" ]; then
        echo "Backup files already exist. Skipping backup..."
        return
    fi
    cp tsconfig.json tsconfig.json.bak
    cp "package.json" "package.json.bak"
}

# Function to remove paths and add npm packages
switch_to_npm() {
    echo "Switching to npm packages..."

    node update-tsconfig-to-use-npm-packages.js
    
    echo "Installing @hsi packages..."
    aws codeartifact login --tool npm --domain shared-package-domain --repository shared-package-repository --domain-owner 922539530544 --namespace @hsi
    npm install @hsi/viz-components@latest 
    npm install @hsi/ui-components@latest
    npm install @hsi/app-dev-kit@latest
    rm -rf dist
    npx nx reset
    echo "Successfully switched to npm packages"
}

# Function to restore local paths
restore_local() {
    echo "Restoring local paths..."
    if [ ! -f "tsconfig.json.bak" ]; then
        echo "Backup files do not exist. Nothing to restore..."
        return
    fi
    cp tsconfig.json.bak tsconfig.json
    cp "package.json.bak" "package.json"

    rm tsconfig.json.bak
    rm package.json.bak
        
    # Run npm install to update dependencies
    npm install

    npx nx reset
    
    echo "Successfully restored local paths"
}

# Main script
case "$1" in
    --npm)
        backup_files
        switch_to_npm
        ;;
    --local)
        restore_local
        ;;
    *)
        echo "Usage: $0 [--npm|--local]"
        echo "  --npm   : Remove paths to local files and install npm packages"
        echo "  --local : Restore local paths configuration"
        exit 1
        ;;
esac
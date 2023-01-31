#!/bin/bash

MANIFEST_VERSION=$1

show_usage () {
    echo "Usage:"
    echo "  ./build.sh MANIFEST_VERSION"
}

if [ -z "$MANIFEST_VERSION" ];
then
    echo "No manifest version specified. Please select one."
    show_usage
    exit 0
fi

MANIFEST_PATH=manifest/$MANIFEST_VERSION/manifest.json

if [ ! -f $MANIFEST_PATH ]; then
    echo "Manifest not found. You can create one and place it in $MANIFEST_PATH."
    exit 0
fi


OUTPUT_DIR=dist


npm run build
cp $MANIFEST_PATH $OUTPUT_DIR/manifest.json
cp src/background.js $OUTPUT_DIR/assets/background.js
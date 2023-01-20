#!/bin/bash

BROWSER=$1
MANIFEST_VERSION=$2

show_usage () {
    echo "Usage:"
    echo "  ./build.sh BROWSER MANIFEST_VERSION"
}

if [ -z "$BROWSER" ];
then
    echo "No browser specified. Please select one."
    show_usage
    exit 0
fi

if [ -z "$MANIFEST_VERSION" ];
then
    echo "No manifest version specified. Please select one."
    show_usage
    exit 0
fi

MANIFEST_PATH=manifest/$MANIFEST_VERSION/$BROWSER.json

if [ ! -f $MANIFEST_PATH ]; then
    echo "Manifest not found. You can create one and place it in $MANIFEST_PATH."
    exit 0
fi


OUTPUT_DIR=dist/$MANIFEST_VERSION/$BROWSER


mkdir -p $OUTPUT_DIR
cp -r app/* $OUTPUT_DIR
cp $MANIFEST_PATH $OUTPUT_DIR/manifest.json
#!/bin/bash

mkdir -p dist/chromium
cp -r app/* dist/chromium
cp manifest/v3/manifest.json dist/chromium/manifest.json

mkdir -p dist/firefox
cp -r app/* dist/firefox
cp manifest/v2/manifest.json dist/firefox/manifest.json
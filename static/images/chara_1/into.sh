#!/bin/bash

for file in *.png; do
  filename=$(basename -- "$file")
  filename_no_ext="${filename%.*}"

	ffmpeg -i $file "${filename_no_ext}.webp"
done

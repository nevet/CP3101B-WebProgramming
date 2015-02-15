#!/bin/sh
HOST_ADDR="/Applications/xampp/xamppfiles/htdocs"

echo "Enter the source folder:"
read PHP_SRC_DIR

if [ ! -d $PHP_SRC_DIR ]; then
	echo "No such directory"
	exit 0
fi

if [ ! -d $PHP_SRC_DIR ]; then
	echo "No files under $PHP_SRC_DIR is found!"
	exit 0
fi

if ! test "$(ls -A "$PHP_SRC_DIR")"; then
	echo "$PHP_SRC_DIR is empty"
	exit 0
fi

PHP_DEST_DIR="$HOST_ADDR/$PHP_SRC_DIR"

echo "Folder will be uploaded to $PHP_DEST_DIR"

exist=false

if [ -d $PHP_DEST_DIR ]; then
	exist=true
	rm -r $PHP_DEST_DIR
fi

mkdir $PHP_DEST_DIR

cp -r $PHP_SRC_DIR $HOST_ADDR

IMAGES=$PHP_DEST_DIR/img/*

for img in $IMAGES
do
	chmod 644 $img
done

if $exist; then
	echo "$PHP_DEST_DIR updated."
else
	echo "$PHP_DEST_DIR uploaded."
fi
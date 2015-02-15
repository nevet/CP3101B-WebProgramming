#!/bin/sh
HOST_ADDR="/Applications/xampp/xamppfiles/htdocs"

echo "Enter the source folder:"
read SRC

if [ ! -d $SRC ]; then
	echo "No such directory"
	exit 0
fi

if [ ! -d $SRC ]; then
	echo "No files under $SRC is found!"
	exit 0
fi

if ! test "$(ls -A "$SRC")"; then
	echo "$SRC is empty"
	exit 0
fi

DEST="$HOST_ADDR/$SRC"

echo "Folder will be uploaded to $DEST"

exist=false

cp -rf $SRC $HOST_ADDR

IMAGES=$DEST/img/*

for img in $IMAGES
do
	chmod 644 $img
done

if $exist; then
	echo "$DEST updated."
else
	echo "$DEST uploaded."
fi
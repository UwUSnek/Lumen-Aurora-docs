#!/bin/bash




cat ./Page/main.html \
    | perl -ne "s/^\s*#include/#include/; print;"                                           `# Remove leading spaces for traditional cpp`               \
    | gcc -I. -E -P -CC -w -xc -traditional-cpp - 2>/dev/tty                                `# Run C preprocessor to merge #include d files`            \
    | perl -0ne "s/^[\S\s]*?(?=<!DOCTYPE html>)//; print;"                                  `# Remove everything added by cpp before the !DOCTYPE tag`  \
    | perl -0ne "s/(\n(\s+)<!--[\S\s]*?-->)|(<!--[\S\s]*?-->)|(<!--[\S\s]*?$)//g; print;"   `# Remove all comments`                                     \
> Lumen-Aurora-Languages.html




# This script merges all of the HTML files into one big .html using C's old preprocessor.
# Perl is used to prepare the input files and clean up the outputted HTML.

#! Removing leading whitespace is required in order for the traditional preprocessor to properly parse include statements.
#! This is only done in the main file as the other ones don't need to indent includes.

#! The preprocessor adds comments at the start of the output file and at the end of most lines.
#! These are removed as otherwise they would break the HTML parsers. C comments are not valid HTML.




# This looks cursed, but it removes the need for complex build systems and dependencies.
# GCC and Perl ship with most Unix systems and basically never change.
# Not having to keep track of additional tools is worth having a slightly unhinged build script.

# This was written by Ila [https://github.com/UwUSnek].
# Take it up with her.
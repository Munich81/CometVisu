#!/usr/bin/env bash
:<<"::CMDLITERAL"
@ECHO OFF
GOTO :CMDSCRIPT
::CMDLITERAL

#docker run --name cv_doc -it --mount type=bind,source="$(pwd)"/../,destination=/home/cometvisu cv-doc-helper
#sudo docker run --name cv_doc -it -v "$(pwd)"/:/home/cometvisu cv-doc-helper
cid=$(docker ps -a -f name=cv_doc --quiet)
if [[ $cid = "" ]]; then
    echo "Creating 'cv_doc' container"
    docker run -it -v "$(pwd)"/:/home/cometvisu --name cv_doc peuter/cv-doc-helper
else
    echo "Starting 'cv_doc' container"
    docker start -i $cid
fi

:CMDSCRIPT
ECHO Welcome to %COMSPEC%
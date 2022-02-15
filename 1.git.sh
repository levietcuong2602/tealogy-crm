#!/bin/bash
# code by cuonglv@vbee.vn

pwd=`pwd`

project_list="\
teaology-crm:master \
" 

echo "Git Command: init | clone | pull"

if [ `ps aux | grep ssh-agent | grep -v grep | wc -l ` -gt 0 ] ; then  
   ps aux | grep ssh-agent | grep -v grep |  tr -s ' ' | cut -d ' ' -f2 | xargs kill ; 
fi

if [ "$1" == "init" ] ; then
  for projecta in $project_list ; do
    echo ; echo ; echo "+++++++++++++++++++" $projecta
    project=`echo $projecta | tr -s ':' | cut -d ':' -f1`
    branch=` echo $projecta | tr -s ':' | cut -d ':' -f2`
    cd $pwd ;
    if [ ! -d ./$project ] ; then mkdir  -p $project ;
    fi
    if [ ! -f ./key.$project ] ; then 
      mkdir  -p $project ; cd $project
      ssh-keygen -t rsa -f ~/.ssh/id_rsa -q -N ""
    fi;
  done
fi 





if [ "$1" == "clone" ] ; then
  for projecta in $project_list ; do
    echo ; echo ; echo "+++++++++++++++++++" $projecta
    project=`echo $projecta | tr -s ':' | cut -d ':' -f1`
    branch=` echo $projecta | tr -s ':' | cut -d ':' -f2`

    cd $pwd ;  
    if [ ! -d ./$project/.git ] ; then
       ps aux | grep "ssh-agent" | grep -v grep | tr -s ' ' | cut -d ' ' -f2 | xargs kill ;
       eval `ssh-agent` ; cd $project ; ssh-add ~/.ssh/id_rsa ;
       git clone -b $branch --depth=1 --progress -v git@github.com:levietcuong2602/$project.git .
    fi
  done
fi



if [ "$1" == "pull" ] ; then
  for projecta in $project_list ; do
    echo ; echo ; echo "+++++++++++++++++++" $projecta
    project=`echo $projecta | tr -s ':' | cut -d ':' -f1`
    branch=` echo $projecta | tr -s ':' | cut -d ':' -f2`

    cd $pwd ;
    if [ -d  /$pwd/$project/.git ] ; then   
       ps aux | grep "ssh-agent" | grep -v grep | tr -s ' ' | cut -d ' ' -f2 | xargs kill ;
       eval `ssh-agent` ; cd $project ; ssh-add ~/.ssh/id_rsa ;
       echo git pull origin $branch;
       git pull origin $branch ; 
    fi
  done
fi


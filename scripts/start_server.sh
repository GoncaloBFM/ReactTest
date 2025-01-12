CWD=$(pwd)
sudo neo4j-admin server start
cd /home/gbfm/Workspaces/PyCharm/AMLVis
conda activate amlvis
export PYTHONPATH="$PYTHONPATH:$PWD"; flask --app src/server.py run
cd CWD

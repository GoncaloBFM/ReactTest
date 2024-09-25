cd Workspaces/PyCharm/AMLVis
conda activate amlvis
sudo neo4j-admin server start
python src/load_into_neo4j.py
sudo neo4j-admin server stop

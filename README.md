Prerequisites
=
- docker
- docker-compose
- The emperor of Makind.

Dev setup
=
    git clone https://github.com/caflamand/ugly-map.git
    sudo docker-compose up

# Convert png to tiles
## Convert png to tif
Covert png to tif with this online tool

[https://onlineconvertfree.com/convert/png/](https://onlineconvertfree.com/convert/png/)

## Install GDAL Ubuntu 20.04
```
sudo add-apt-repository ppa:ubuntugis/ppa && sudo apt-get update
sudo apt-get update
sudo apt-get install gdal-bin
sudo apt-get install libgdal-dev
export CPLUS_INCLUDE_PATH=/usr/include/gdal
export C_INCLUDE_PATH=/usr/include/gdal
pip install GDAL
```

## Use GDAL2tiles.py
If not in path: /usr/bin/gdal2tiles
```
gdal2tiles.py -p raster --s_srs ESPG:xyz --xyz -z 0-6 -w leaflet -t LanETS-MAP.png <input_file> <output_directory>/
```
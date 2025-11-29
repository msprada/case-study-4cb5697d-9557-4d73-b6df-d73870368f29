# Installation

## Install docker 

## Install docker-compose

## PUll all Imgages by
```
docker pull IMAGE_NAME
```

## Start all Applications
```
cd ops/db && docker-compose up
``` 
- this will start the mongoDB Server

## Connect to MongoDB


```
sudo docker exec -it mongodb mongosh --username admin-user
```

### Test Status

```
db.runCommand({connectionStatus:1});
```


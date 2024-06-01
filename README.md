# TradingGame


## Clone the project
```bash

  C:\Users\Kaver> git clone https://github.com/kaverigojre/TradingGame.git 
  PS C:\Users\Kaver> cd .\TradingGame\
  PS C:\Users\Kaver\TradingGame> ls
  Directory: C:\Users\Kaver\TradingGame

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        26-04-2024  04:27 PM                Client
d-----        25-05-2024  11:28 AM                Server
d-----        25-05-2024  05:32 PM                websockets
-a----        15-04-2024  12:45 PM           2177 .gitignore
-a----        25-05-2024  11:28 AM            285 docker-compose.yml
-a----        26-05-2024  03:59 PM             28 README.md
```

## Setup the Docker file and creating tiers: 
  ## add .env file in client folder and add below attributes

``bash
AWS_REGION = ""
AWS_ACCESS_KEY_ID = ""
AWS_SECRET_ACCESS_KEY = ""
AWS_BUCKET_NAME = ""
SECRET_KEY=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
MONGODB_CONNECTION_STRING=""

```
## run docker file



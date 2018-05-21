docker build -t powermon.js:3 .
docker stop powermon3.js && docker rm powermon3.js && docker run -d --name powermon3.js -e "MONGO_POWERMON_URI=mongodb://powermon/powermon" --link powermon:powermon -p 3001:3000/TCP powermon.js:3


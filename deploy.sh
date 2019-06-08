#docker build -t scurrent/multi-client -f ./client/Dockerfile ./client
#docker build -t scurrent/multi-server -f ./server/Dockerfile ./server
#docker build -t scurrent/multi-worker -f ./worker/Dockerfile ./worker
#docker push scurrent/multi-client
#docker push scurrent/multi-server
#docker push scurrent/multi-worker
#kubectl apply -f k8s
#kubectl set image deployments/server-deployment server=scurrent/multi-server


docker build -t scurrent/multi-client:latest -t/scurrent/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t scurrent/multi-server:latest -t/scurrent/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t scurrent/multi-worker:latest -t/scurrent/multi-worker:$SHA -f ./worker/Dockerfile ./worker

docker push scurrent/multi-client:latest
docker push scurrent/multi-server:latest
docker push scurrent/multi-worker:latest

docker push scurrent/multi-client:$SHA
docker push scurrent/multi-server:$SHA
docker push scurrent/multi-worker:$SHA

kubectl apply -f k8s

kubectl set image deployments/server-deployment server=scurrent/multi-server:$SHA
kubectl set image deployments/client-deployment server=scurrent/multi-client:$SHA
kubectl set image deployments/worker-deployment server=scurrent/multi-worker:$SHA

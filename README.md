# nestjs_kafka
Basic setup for routing a nestjs project using microservices


# docker-compose.test.yaml
Passo a passo para testar os brokers:

### 1 - Rode o docker compose.
```bash
docker compose -f docker-compose.test.yaml up -d
```
### 2 - Abra um dos Broker kafka.
```bash
docker exec -it nestjs_kafka-kafka-1-1 bash
```
### 3 - Crie um tópico.
```bash
kafka-topics --create --bootstrap-server localhost:29092 --replication-factor 3 --partitions 3 --topic meutopico
```

### 4 - Abra o producer do seu tópico.
```bash
kafka-console-producer --broker-list localhost:29092 --topic meutopico
```

### 5 - Abra pelo menos um consumer.
#### Dica - os consumers devem ser abertos em outros terminais para a visualização em tempo real 
Consumer único.
```bash
kafka-console-consumer --bootstrap-server localhost:29092 --topic meutopico
```

Grupo de consumer.
```bash
kafka-console-consumer --bootstrap-server localhost:29092 --topic meutopico --from-beginning --group a
```

### 5 - teste e veja como funciona.
(●'◡'●)

### 6 - Ler as mensagens desde o inicio.
```bash
kafka-console-consumer --bootstrap-server localhost:29092 --topic meutopico --from-beginning
```
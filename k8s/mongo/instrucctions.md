```sh
    kubectl exec -it mongo-0 -- mongo
```

```sh
    rs.initiate({
        _id: "rs0",
        members: [
            { _id: 0, host: "mongo-0.mongo-svc-h:27017" },
        ]
    })
```


Note: The "rs0" name is arbitrary. You can use whatever you'd like, but you'll need to change it in the mongo-simple.yaml StatefulSet definition as well.

Once you have initiated the Mongo ReplicaSet, you can add the remaining replicas by running the following commands in the mongo tool on the mongo-0.mongo-svc-h `Pod`:

```sh
    rs.add("mongo-1.mongo-svc-h:27017")
    rs.add("mongo-2.mongo-svc-h:27017")
```
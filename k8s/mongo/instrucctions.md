```sh
    kubectl exec -it mongo-0 -- mongosh1
```

```sh
    rs.initiate({
    _id: "rs0",
    members: [
        { _id: 0, host: "mongo-0.mongo:27017" },
        { _id: 1, host: "mongo-1.mongo:27017" },
        { _id: 2, host: "mongo-2.mongo:27017" }
    ]
    })
```



Show the status of the replica set:
```sh
    rs.status()
```


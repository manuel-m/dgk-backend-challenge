import { k8s } from "../k8s.mjs";

// mongodb personal information
export const mongopi = { Yaml };

function Yaml({ deploy, dist_path, mservice_id, mservicesMap }) {
  const { image, port } = mservicesMap[mservice_id];

  return `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: ${k8s.yaml.deploy.name(mservice_id)}
  namespace: ${deploy}
spec:
  serviceName: database
  replicas: 1
  selector:
    matchLabels:
      app: ${mservice_id}
  template:
    metadata:
      labels:
        app: ${mservice_id}
        selector: mongodb
    spec:
      volumes:
      #- name: mongopi-rw
      #  hostPath:
      #    path: ${dist_path}/data/${mservice_id}
      #    type: Directory    
      containers:
      - name: ${k8s.yaml.container.name(mservice_id)}
        image: ${image}
        #volumeMounts:
        #- name: mongopi-rw
        #  mountPath: /data/db
        env:
          - name: MONGO_INITDB_ROOT_USERNAME
            value: admin
          - name: MONGO_INITDB_ROOT_PASSWORD
            value: password
---
apiVersion: v1
kind: Service
metadata:
  name: ${k8s.yaml.service.name(mservice_id)}
  namespace: ${deploy}
  labels:
    app: ${mservice_id}
spec:
  selector:
    app: ${mservice_id}
  ports:
    - name: ${k8s.yaml.port.name(mservice_id)}
      port: ${port}
      targetPort: ${port}
      protocol: TCP
`;
}

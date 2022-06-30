import { k8s } from "../k8s.mjs";

// postgres personal information
export const postgrespi = { Yaml };

function Yaml({
  deploy,
  dist_path,
  mservice_id,
  pi_user,
  pi_password,
  mservicesMap,
}) {
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
    spec:
      volumes:
      #- name: postgrespi-rw
      #  hostPath:
      #    path: ${dist_path}/data/${mservice_id}
      #    type: Directory    
      containers:
      - name: ${k8s.yaml.container.name(mservice_id)}
        image: ${image}
        #volumeMounts:
        #- name: postgrespi-rw
        #  mountPath: /data/db
        env:
          - name: POSTGRES_USER
            value: ${pi_user}
          - name: POSTGRES_PASSWORD
            value: ${pi_password}
          - name: POSTGRES_DB
            value: ${pi_user}
---
apiVersion: v1
kind: Service
metadata:
  name: ${k8s.yaml.container.name(mservice_id)}
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

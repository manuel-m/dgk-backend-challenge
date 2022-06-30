import { yaml } from "./k8s.yaml.mjs";

export const k8s = {
  sbin: { debug, events, logs, restart, start, stop, watch },
  yaml,
};

function logs({ deploy }) {
  return `kubectl logs -l app=$1 -n ${deploy} -f`;
}

function start({ deploy, mservices_enabled }) {
  return [
    "#k3s start sequence",
    `kubectl create namespace ${deploy}`,
    ...mservices_enabled.map(
      (mservice_id) => `kubectl apply -f dist/${deploy}/k8s/${mservice_id}.yaml`
    ),
  ].join("\n");
}

function stop({ deploy }) {
  return ["#k3s stop sequence", `kubectl delete namespace ${deploy}`].join(
    "\n"
  );
}

function watch({ deploy }) {
  return `watch -t kubectl get pods,svc,ep,deployment -n=${deploy}`;
}

function events({ deploy }) {
  return `kubectl get events -n ${deploy}`;
}

function debug({ deploy }) {
  return `kubectl exec -n ${deploy} -it $(kubectl get pods -n ${deploy}|grep ^\${1} | cut -d' ' -f1) \
-- /bin/bash`;
}

function restart({ deploy }) {
  return [
    `kubectl delete -f dist/${deploy}/k8s/$1.yaml`,
    "npm run setup",
    "npm run build",
    "sleep 2",
    `kubectl apply -f dist/${deploy}/k8s/$1.yaml`,
  ].join("&&");
}

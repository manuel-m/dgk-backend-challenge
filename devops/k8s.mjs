export const k8s = { sbin: { debug, start, stop, watch } };

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

function debug({ deploy }) {
  return `kubectl exec -n ${deploy} -it $(kubectl get pods -n ${deploy}|grep ^\${1} | cut -d' ' -f1) \
-- /bin/bash`;
}

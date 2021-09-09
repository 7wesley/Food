# Food

> A full stack application intended to be deployed to a Kubernetes cluster with a food theme.

## Description

This app demonstrates communication between a client and a server and how it's handled through a container orchestration service. It also aims to demonstrate a typical devops process of setting up a CI/CD environment within a cluster. The frontend utilizes the Vue CDN while the backend creates a REST API via Golang. The backend also communicates with a postgres database in order to save user entries.

## Built with

* [Docker](https://www.docker.com/)
* [Jenkins](https://www.jenkins.io/)
* [Kubernetes](https://kubernetes.io/)
* [Bootstrap](https://getbootstrap.com)
* [Vue](https://vuejs.org/)
* [Golang](https://golang.org/)
* [Postgres](https://www.postgresql.org/)

## Getting Started

### Run project locally without containers
1. Create a `.env` file in the `/server` directory with the following format:
    ``` bash
    DIALECT="postgres"
    HOST="localhost"
    DB_PORT=5432
    USER=
    DBNAME=
    PASSWORD=
    ORIGIN_ALLOWED=
    HOSTPORT=":10001"
    POSTGRES_PASSWORD=
    POSTGRES_USER=
    ```
* Replace the values with ones from your local environment.
2. Build the go app
    ```sh
    go build
    ```
3. Run the app (Executable should be named 'Food')
    ```sh
    ./Food
    ```
4. Open `index.html` in `/client` and host it locally (VSCode Live Server, Intelij Live Server). Make sure that ORIGIN_ALLOWED from step 2 is set to the port the server is hosted on (ex:":localhost:5500")

### Run project locally with containers
1. The `.env` file the `docker-compose.yaml` file uses has been included for convenience. Change its values to match your local environment.
2. In the root of the repository, type:
    ```sh
    docker-compose up
    ```
    This will automatically create containers for the client, server, and database. Change the ports in `docker-compose.yaml` as necessary.

### Run project locally with kubernetes
1. Create a Kubernetes cluster. I used minikube
    ```sh
    minikube start --driver=hyperkit
    ```
2. Create namespace for jenkins
    ```sh
    kubectl create ns jenkins
    ```
3. Create a postgres secret named `postgres-secret` with the following layout in `/kubernetes`. 
    ```bash
    apiVersion: v1
    kind: Secret
    metadata:
      name: postgres-secret
    type: Opaque
    data:
      postgres-username:
      postgres-password:
    ```
4. Apply all setup files
    ```sh
    kubectl apply -f kubernetes -R
    ```
5. Enable the ingress addon from minikube so the ingress controller pod can be utilized
    ```sh
    minikube addons enable ingress
    ```
6. Access cluster via ingress
    ```sh
    minikube ip
    ```
    Access the app via the IP. The root path `/` should reveal the frontend and `/food/*` should allow access to the REST API.
### Optional: Jenkins CI/CD
7. Get password from Jenkins container
    ```sh
    kubectl -n jenkins logs <jenkins-pod>
    ```
8. Port forward jenkins pod
    ```sh
    kubectl -n jenkins port-forward <jenkins-pod> 8080
    ```
9. Install suggested plugins, then go to Manage Jenkins > Manage Plugins and install the Kubernetes and Docker pipeline plugins.
10. Go to Manage Jenkins > Manage Nodes & Clouds > Configure Clouds > Add new cloud (Kubernetes)
Fill out plugin values for connecting to local kubernetes cluster:
    * Name: kubernetes
    * Kubernetes URL: https://kubernetes.default:443
    * Kubernetes Namespace: jenkins
    * Credentials | Add | Jenkins (Choose Kubernetes service account option & Global + Save)
    * Jenkins URL: http://jenkins
    * Tunnel: jenkins:50000
11. Add credentials for dockerhub at Manage Jenkins > Manage Credentials > Global > Add Credentials
12. Create a new job, click pipeline, go to pipeline section and change the definition to "pipeline script from SCM" and point it to the Jenkinsfile in this repo.
13. Go to build triggers and select Poll SCM. Enter `* * * * *` to poll every minute for testing.
	* Commit a new change and Jenkins will automatically trigger a build and deploy it to the server 👍

### Side-note: ArgoCD
Optionally you can have ArgoCD manage the cluster and sync it to your gitops repository. In this case, it can be synced to the `/kubernetes` directory. A file has been provided in `/kubernetes/argocd`. Add argocd to your cluster, create namespaces & secrets, then run:
    ```sh
        kubectl -n argocd apply -f kubernetes/argocd
    ```
Instead of using Jenkins entirely for CI/CD, you could have Jenkins only update the deployment yaml to match the docker image tag, commit it, and then have ArgoCD take care of the deployment.

## Takeaways

With this Jenkins pipeline, each new push to the code repository will trigger a new build. In this build, a jenkins agent is created via a pod where the repository is cloned, docker images are built, docker images are pushed to an image registry, and the kubernetes deployments are redeployed in order for them to pull from the updated image registries (the :latest image tag will always re-pull images on redeployment). This allows for a convenient continuous integration and continuous delivery system whenever a developer pushes changes to a repository. The cluster has also been integrated with persistent volume and persistent volume claims so that despite pod destruction, new postgres and jenkins pods will be mounted with their previously retained data.

In the future I probably wouldn't use Jenkins for CD, it seems that there are other tools that are much better for that purpose.

## Authors

[Wesley Miller](https://github.com/7wesley)
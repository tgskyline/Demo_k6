clear 

path=$1

read -p "Deseja gerar Web DashBoard Local [true ou false]: " wd
echo -e "----------------------------------------------------------------------------------"
read -p "Como deseja executar o teste [local - local/cloud - cloud]: " runtest
echo -e "----------------------------------------------------------------------------------"
read -p "Deseja usar o EndPoint "/public" [true ou false]: " url
echo -e "----------------------------------------------------------------------------------"

if [[ "$runtest" == "local" ]]; then
    echo -e "\nExecutando teste com URL definida no código"
    K6_WEB_DASHBOARD=$wd K6_WEB_DASHBOARD_EXPORT=report/html-report.html k6 run $path
elif [[ "$runtest" == "cloud" ]]; then
    echo -e "\nExecutando teste na Nuvem/Cloud"
    K6_WEB_DASHBOARD=$wd K6_WEB_DASHBOARD_EXPORT=report/html-report.html k6 cloud $path
elif [[ "$url" == "true" ]]; then      
    echo -e "\nExecutando teste com URL definida pelo usuário"
    K6_WEB_DASHBOARD=$wd K6_WEB_DASHBOARD_EXPORT=report/html-report.html k6 run $path --env URL=https://test-api.k6.io/public
elif [[ "$runtest" == "local/cloud" ]]; then
    echo -e "\nExecutando teste local com resultados na Nuvem/Cloud"
    K6_WEB_DASHBOARD=$wd K6_WEB_DASHBOARD_EXPORT=report/html-report.html k6 run --out cloud $path
fi
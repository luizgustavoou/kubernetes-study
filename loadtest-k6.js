import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Configuração de carga similar ao comando Fortio:
  // kubectl run -it fortio --rm --image=fortio/fortio \
  // -- load -qps 800 -t 120s -c 70 "http://goserver-service/healthz"
  
  stages: [
    { duration: '10s', target: 70 },    // Ramp-up: sobe de 0 para 70 usuários em 10s
    { duration: '100s', target: 70 },   // Sustain: mantém 70 usuários por 100s (total 110s até aqui)
    { duration: '10s', target: 0 },     // Ramp-down: desce para 0 em 10s (total 120s)
  ],
  
  // Configurações de desempenho
//   thresholds: {
//     'http_req_duration': ['p(95)<500', 'p(99)<1000'],  // 95% < 500ms, 99% < 1s
//     'http_req_failed': ['rate<0.1'],                    // Taxa de erro < 10%
//   },
};

// Função principal que será executada por cada usuário virtual
export default function () {
  // Endpoint do serviço Kubernetes
  const url = 'http://localhost:9000/healthz';
  
  // Fazer requisição GET
  const response = http.get(url, {
    timeout: '5s',
  });
  
  // Validações
  check(response, {
    'status é 200': (r) => r.status === 200,
    'status é 500 ou 200 (durante inicialização)': (r) => r.status === 200 || r.status === 500,
    'tempo resposta < 500ms': (r) => r.timings.duration < 500,
    'resposta contém "up"': (r) => r.body.includes('up') || r.status !== 200,
  });
  
  // Sem sleep aqui para alcançar ~800 RPS com 70 usuários
  // 800 RPS / 70 usuários = ~11.4 requisições por usuário por segundo
  // O k6 mantém isso automaticamente durante os stages configurados
}

import { Component, AfterViewInit } from '@angular/core';
import { DatabaseService } from 'src/app/auth/services/database.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements AfterViewInit {
  listaEncuestas: any[] = [];

  constructor(private database: DatabaseService) {}

  ngAfterViewInit() {
    this.database.obtenerTodos("encuestas")?.subscribe(encuestas => {
      this.listaEncuestas = encuestas.map((encuesta: any) => encuesta.payload.doc.data());
      this.dibujarGraficoTorta();
      this.dibujarGraficoBarrasHorizontal();
      this.dibujarGraficoBarrasVertical();
    });
  }

  dibujarGraficoTorta() {
    const valoracionesAtencion = this.calcularPorcentajeCaracteristicas();

    const labels = Object.keys(valoracionesAtencion);
    const data = Object.values(valoracionesAtencion);

    Chart.register(...registerables); // Registrar módulos adicionales si es necesario

    new Chart('valoracionCaracteristicas', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ]
        }]
      }
    });
  }

  calcularPorcentajeCaracteristicas() {
    const caracteristicasCount: { [key: string]: number } = this.listaEncuestas.reduce((acc: { [key: string]: number }, encuesta: any) => {
      const caracteristicas: string[] = encuesta.caracteristicas;
      caracteristicas.forEach((caracteristica: string) => {
        acc[caracteristica] = (acc[caracteristica] || 0) + 1;
      });
      return acc;
    }, {});

    const totalEncuestas = this.listaEncuestas.length;

    // Calcular porcentajes
    const porcentajes: { [key: string]: number } = {};
    Object.keys(caracteristicasCount).forEach((key: string) => {
      const count = caracteristicasCount[key];
      porcentajes[key] = (count / totalEncuestas) * 100;
    });

    return porcentajes;
  }

  dibujarGraficoBarrasHorizontal() {
    // Recolecta las valoraciones de las encuestas
    const valoraciones = this.listaEncuestas.map(encuesta => encuesta.valoracionAtencion);

    // Cuenta la ocurrencia de cada valoración
    const conteoValoraciones = valoraciones.reduce((acc, valor) => {
        acc[valor] = (acc[valor] || 0) + 1;
        return acc;
    }, {});

    // Transforma los datos para Chart.js
    const labels = Object.keys(conteoValoraciones); // Las distintas valoraciones (e.g., "Excelente", "Muy buena")
    const data = Object.values(conteoValoraciones); // El conteo de cada valoración

    // Dibuja el gráfico
    const chart = new Chart('valoracionAtencion', {
        type: 'bar', // Cambia a gráfico de barras horizontal
        data: {
            labels: labels, // Etiquetas de las valoraciones
            datasets: [{
                label: 'Valoración de Atención',
                data: data, // Conteos de cada valoración
                backgroundColor: 'rgba(255, 99, 132, 0.6)', // Color de las barras
                borderWidth: 1
            }]
        },
        options: {
           indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true // Inicia el eje y en cero
              }
            }
        }
    });
}


dibujarGraficoBarrasVertical() {
  // Recolecta las valoraciones de los platos
  const valoraciones = this.listaEncuestas.map(encuesta => encuesta.valoracionPlatos);

  // Cuenta la ocurrencia de cada valoración
  const conteoValoraciones = valoraciones.reduce((acc, valor) => {
      acc[valor] = (acc[valor] || 0) + 1;
      return acc;
  }, {});

  // Transforma los datos para Chart.js
  const labels = Object.keys(conteoValoraciones); // Las distintas valoraciones (e.g., "Excelente", "Muy buena")
  const data = Object.values(conteoValoraciones); // El conteo de cada valoración

  // Limpia el canvas antes de dibujar el nuevo gráfico
  const canvas = document.getElementById('valoracionPlatos') as HTMLCanvasElement;
  if (canvas) {
    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Dibuja el gráfico
  const chart = new Chart('valoracionPlatos', {
      type: 'bar',
      data: {
          labels: labels, // Etiquetas de las valoraciones
          datasets: [{
              label: 'Valoración de Platos',
              data: data, // Conteos de cada valoración
              backgroundColor: 'rgba(24, 49, 83, 1)', // Color de las barras
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              x: {
                  stacked: true // Apilar barras si es necesario
              },
              y: {
                  beginAtZero: true // Inicia el eje y en cero
              }
          }
      }
  });
}
}

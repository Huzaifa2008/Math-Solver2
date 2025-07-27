let currentChart = null;

async function calculate(operation) {
  const value = document.getElementById('inputValue').value;
  const response = await fetch('/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value, operation })
  });

  const data = await response.json();
  const resultDiv = document.getElementById('result');
  resultDiv.innerText = data.result !== undefined ? `Result: ${data.result}` : `Error: ${data.error}`;
}

async function plotFunction() {
  const funcStr = document.getElementById('functionInput').value;
  if (!funcStr) return;

  const response = await fetch('/evaluate_function', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ function: funcStr })
  });

  const data = await response.json();
  if (data.error) {
    alert(data.error);
    return;
  }

  const ctx = document.getElementById('graphCanvas').getContext('2d');
  if (currentChart) currentChart.destroy();

  currentChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.x,
      datasets: [{
        label: `f(x) = ${funcStr}`,
        data: data.y,
        borderColor: 'lime',
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
  responsive: true,
  scales: {
   x: {
  type: 'linear',
  position: 'bottom',
  min: -10,
  max: 10,
  grid: {
  color: (ctx) => ctx.tick.value === 0 ? 'white' : '#444',
  lineWidth: (ctx) => ctx.tick.value === 0 ? 2 : 1
},
  ticks: {
    color: 'white'
  },
  title: {
    display: true,
    text: 'x',
    color: 'white'
  }
},
y: {
  type: 'linear',
  min: -10,
  max: 10,
  grid: {
    color: (ctx) => ctx.tick.value === 0 ? 'white' : '#444',
    lineWidth: (ctx) => ctx.tick.value === 0 ? 2 : 1
  },
  ticks: {
    color: 'white'
  },
  title: {
    display: true,
    text: 'f(x)',
    color: 'white'
  }
}
  },
  plugins: {
    legend: {
      labels: {
        color: 'white'
      }
    }
  }
}
  });
}

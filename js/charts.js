document.addEventListener('DOMContentLoaded', function() {
    const chartCanvas = document.getElementById('sentimentChart');
    if (!chartCanvas) return;

    const createChart = () => {
        const sentimentChartCtx = chartCanvas.getContext('2d');
        new Chart(sentimentChartCtx, {
            type: 'doughnut',
            data: {
                labels: ['Negatif', 'Positif', 'Netral'],
                datasets: [{
                    data: [75, 15, 10],
                    backgroundColor: ['#e74c3c', '#2ecc71', '#bdc3c7'],
                    borderColor: '#FFFFFF',
                    borderWidth: 5,
                    hoverOffset: 10,
                    hoverBorderColor: '#FDFBF8'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { family: "'Inter', sans-serif", size: 14 },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label || ''}: ${context.parsed || 0}%`;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    };

    const chartObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                createChart();
                observer.unobserve(chartCanvas);
            }
        });
    }, { threshold: 0.5 });

    chartObserver.observe(chartCanvas);
});
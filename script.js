let chart;

fetch('data.json')
.then(response => response.json())
.then(data => {

    const monthSelect = document.getElementById("monthFilter");
    const categorySelect = document.getElementById("categoryFilter");

    // Populate Filters
    const months = [...new Set(data.map(item => item.month))];
    const categories = [...new Set(data.map(item => item.category))];

    months.forEach(month => {
        const option = document.createElement("option");
        option.value = month;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    function updateDashboard() {

        const selectedMonth = monthSelect.value;
        const selectedCategory = categorySelect.value;

        const filteredData = data.filter(item =>
            (selectedMonth === "All" || item.month === selectedMonth) &&
            (selectedCategory === "All" || item.category === selectedCategory)
        );

        // KPIs
        const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
        const totalOrders = filteredData.reduce((sum, item) => sum + item.orders, 0);
        const avgOrderValue = totalOrders === 0 ? 0 : totalRevenue / totalOrders;

        document.getElementById("totalRevenue").innerText = "$" + totalRevenue;
        document.getElementById("totalOrders").innerText = totalOrders;
        document.getElementById("avgOrderValue").innerText = "$" + avgOrderValue.toFixed(2);

        renderChart(filteredData);
    }

    function renderChart(filteredData) {

        const revenueByMonth = {};

        filteredData.forEach(item => {
            revenueByMonth[item.month] = (revenueByMonth[item.month] || 0) + item.revenue;
        });

        const labels = Object.keys(revenueByMonth);
        const values = Object.values(revenueByMonth);

        if (chart) chart.destroy();

        const ctx = document.getElementById("revenueChart");

        chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Revenue by Month",
                    data: values
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }
                }
            }
        });
    }

    monthSelect.addEventListener("change", updateDashboard);
    categorySelect.addEventListener("change", updateDashboard);

    updateDashboard();
});

// Dark Mode
document.getElementById("darkModeToggle")
.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

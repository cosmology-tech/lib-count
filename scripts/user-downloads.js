const https = require('https');

const username = 'pyramation'; // put your username here ;)

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          resolve(JSON.parse(data));
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

async function fetchPackagesByUser(user) {
  const url = `https://registry.npmjs.org/-/v1/search?text=maintainer:${user}&size=100`;
  const data = await fetch(url);
  return data.objects.map((pkg) => pkg.package.name);
}

async function fetchDownloadCounts(packageName, period) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - period);
  const start = `${startDate.getFullYear()}-${String(
    startDate.getMonth() + 1
  ).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
  const end = `${endDate.getFullYear()}-${String(
    endDate.getMonth() + 1
  ).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
  const url = `https://api.npmjs.org/downloads/point/${start}:${end}/${packageName}`;
  const result = await fetch(url);
  return result.downloads || 0;
}

async function getDownloadStats(packages) {
  const weeklyDownloads = await Promise.all(
    packages.map((pkg) => fetchDownloadCounts(pkg, 7))
  );
  const monthlyDownloads = await Promise.all(
    packages.map((pkg) => fetchDownloadCounts(pkg, 30))
  );
  const totalDownloads = await Promise.all(
    packages.map((pkg) => fetchDownloadCounts(pkg, 365))
  );

  const weeklyTotal = weeklyDownloads.reduce(
    (total, count) => total + count,
    0
  );
  const monthlyTotal = monthlyDownloads.reduce(
    (total, count) => total + count,
    0
  );
  const yearlyTotal = totalDownloads.reduce((total, count) => total + count, 0);

  return {
    weeklyTotal: weeklyTotal.toLocaleString(),
    monthlyTotal: monthlyTotal.toLocaleString(),
    yearlyTotal: yearlyTotal.toLocaleString()
  };
}

(async () => {
  const packages = await fetchPackagesByUser(username);
  const { weeklyTotal, monthlyTotal, yearlyTotal } = await getDownloadStats(
    packages
  );
  console.log(
    `Weekly downloads for packages maintained by ${username}: ${weeklyTotal}`
  );
  console.log(
    `Monthly downloads for packages maintained by ${username}: ${monthlyTotal}`
  );
  console.log(
    `Total downloads for the last year for packages maintained by ${username}: ${yearlyTotal}`
  );
})();

const fetch = require("node-fetch");

async function loadData(url) {
  const result = { data: [], isLoading: true, error: null };

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
    const json = await response.json();
    result.data = json;
    result.isLoading = false;
  } catch (err) {
    result.error = err.message;
    result.isLoading = false;
  }

  return result;
}

module.exports = { loadData };

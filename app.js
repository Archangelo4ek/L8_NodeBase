const bcrypt = require("bcrypt");
require("dotenv").config();

console.log("Текущий режим работы приложения:", process.env.MODE);

const passwords = Array.from({ length: 13 }, (_, i) => `password${i + 1}`);

async function hashPasswords() {
  const saltRounds = 10;
  const results = [];

  await Promise.all(
    passwords.map(async (pwd, idx) => {
      const start = Date.now();
      const hash = await bcrypt.hash(pwd, saltRounds);
      const end = Date.now();
      const duration = end - start;
      results.push({ pwd, hash, duration });
      console.log(`Пароль ${idx + 1} зашифрован за ${duration} мс`);
    })
  );

  console.log("\nИтоговый лог:");
  results.forEach(r =>
    console.log(`${r.pwd} → ${r.duration} мс`)
  );

  console.log(
    "\nВывод: время отличается, потому что bcrypt использует асинхронные операции с генерацией соли и хэшированием. " +
    "Каждый пароль обрабатывается независимо, нагрузка распределяется по ядрам процессора, " +
    "поэтому значения разные, но примерно в одном диапазоне"
  );
}

hashPasswords();
const { sortStrings } = require("./modules/sortStrings");
const { loadData } = require("./modules/fetchData");
const { createDir, writeFile } = require("./modules/fileSystem");
const path = require("path");

async function main() {
  const result = await loadData("https://jsonplaceholder.typicode.com/users");

  if (result.error) {
    console.error("Ошибка загрузки:", result.error);
    return;
  }

  const sortedUsers = sortStrings(result.data.map(user => user.name));

  const usersDir = path.join(__dirname, "users");
  createDir(usersDir);

  const namesFile = path.join(usersDir, "names.txt");
  const emailsFile = path.join(usersDir, "emails.txt");

  writeFile(namesFile, sortedUsers.join("\n"));
  writeFile(emailsFile, result.data.map(user => user.email).join("\n"));

  console.log("Файлы созданы: names.txt и emails.txt");
}

main();

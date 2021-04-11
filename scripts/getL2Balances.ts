// @ts-ignore
import getBalances from "../dist/actions/getBalances";

async function main() {
  await getBalances();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

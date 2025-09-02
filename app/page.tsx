import styles from "./page.module.scss";
import PageContainer from "@/containers/pape-container";
import { fetchData } from "@/services/api";

export default async function Home() {
  const initialProducts = await fetchData<any>("/v1/products");
  const initialCart = await fetchData<any>("/v1/carts/user");

  return (
    <div className={styles.container}>
      <div className={styles.pageWrapper}>
        <main className={styles.main}>
          <PageContainer initialProducts={initialProducts?.data?.items || []} initialCart={initialCart?.data || null} />
        </main>
      </div>
    </div>
  );
}

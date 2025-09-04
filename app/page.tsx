import styles from "./page.module.scss";
import PageContainer from "@/containers/pape-container";
import { fetchData } from "@/services/api";
import { ProductModel } from "@/models/product";
import { CartModel } from "@/models/cart";

interface ProductsResponse {
  code: number;
  message: string
  data: {
    items: ProductModel[]
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    }
  }; 
}

interface CartResponse {
  code: number;
  message: string;
  data: CartModel;
}

export default async function Home() {
  const initialProducts = await fetchData<ProductsResponse>("/v1/products");
  const initialCart = await fetchData<CartResponse>("/v1/carts/user");

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

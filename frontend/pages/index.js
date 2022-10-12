import Aside from "../components/Aside";
import Header from "../components/Header";
import Layout from "../components/common/Layout";
import Main from "../components/Main";
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <Layout>
      <Header />

      <div className={styles.container}>
        <Main />
        <Aside />
      </div>
    </Layout>
  );
}
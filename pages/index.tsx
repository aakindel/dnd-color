import type { NextPage } from "next";
import Head from "next/head";
import BasicLayout from "../layouts/BasicLayout";
import Container from "../components/Container";
import DragNDropColor from "../components/DragNDropColor";
import styles from "../styles/pages/Home.module.scss";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Color Palette</title>
        <meta name="description" content="Create Color Palette" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BasicLayout>
        <Container type="page">
          <h1
            className="c-display"
            style={{
              fontSize: "24px",
              color: "#333",
              fontWeight: "600",
              marginBottom: "24px",
            }}
          >
            Colors
          </h1>

          <DragNDropColor />

          <div style={{ marginBottom: "30vh" }}></div>
        </Container>
      </BasicLayout>
    </div>
  );
};

export default Home;

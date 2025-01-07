import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.scss';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className={clsx('container', styles.headerColors)}>
        <div className="hero-bg-shapes-left"></div>
        <div className="hero-bg-shapes-right"></div>
        <h1 className="hero__title">{siteConfig.title}</h1>
        <h5 className="hero__subtitle">{siteConfig.tagline}</h5>
        <div className={styles.buttons}>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="The Rocket League Gym">
      <HomepageHeader />
      <main
      className={clsx(styles.homepageButtons)}
      >
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  // const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container homebanner">
        <h1>Hello, <span className={clsx('your-name', styles.yourName)}>archway12891</span></h1>
        <h1 className="ln-2">This is who you are</h1>
        <h1 className="ln-3">in Archway</h1>
        <div className={clsx('subtitle', styles.subtitle)}>
          <p className={clsx('subtitle-text', styles.subtitleText)}>A social security number is how official sources identify you, but not how you introduce yourself. You do that with your name. Start using your ArchID instead of an unmemorable string to identify yourself in Archway.</p>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  // const {siteConfig} = useDocusaurusContext();
  const title = "More than a name";
  return (
    <Layout
      title={title}
      description="ArchID is a name service for Archway Network, supporting domains, subdomains, and web2 identity verification. Let's build the metaverse together!">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

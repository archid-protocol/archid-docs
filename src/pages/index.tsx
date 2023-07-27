import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

// import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
// const {siteConfig} = useDocusaurusContext();

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container homebanner">
        <h1>Hello, <span className={clsx('your-name', styles.yourName)}>archway12891</span></h1>
        <h1 className="ln-2">This is who you are</h1>
        <h1 className="ln-3">in Archway</h1>
        <div className={clsx('subtitle', styles.subtitle)}>
          <p className={clsx('subtitle-text', styles.subtitleText)}>ArchID needs your help with building the metaverse! Read these docs and learn secret knowledge for building ArchID support in your applications. Building together we can unite the Cosmos.</p>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
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

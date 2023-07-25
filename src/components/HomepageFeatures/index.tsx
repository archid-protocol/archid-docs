import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Learn the Basics',
    Svg: require('@site/static/img/archprint.svg').default,
    description: (
      <>
        ArchID is a web3 domain name system built for Archway Network. Learn more about ArchID, your journey begins here.
      </>
    ),
    link: '/docs/start',
  },
  {
    title: 'Contract Developers',
    Svg: require('@site/static/img/token.svg').default,
    description: (
      <>
        Smart contract developers can integrate ArchID to register and manage domains from their CosmWasm smart contracts.
      </>
    ),
    link: '/docs/contracts/intro',
  },
  {
    title: 'Dapp Developers',
    Svg: require('@site/static/img/token-update.svg').default,
    description: (
      <>
        Dapp developers can call the ArchID Registry contract directly. Learn how to execute and query the Registry from your dapp.
      </>
    ),
    link: '/docs/dapps/intro',
  },
];

function Feature({title, Svg, description, link}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <Link to={link}>
        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
        </div>
      </Link>
      <div className="text--center padding-horiz--md">
        <Link to={link} className={clsx('title-link', styles.titleLink)}>
          <h3 className={clsx('title-link', styles.titleLink)}>{title}</h3>
        </Link>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

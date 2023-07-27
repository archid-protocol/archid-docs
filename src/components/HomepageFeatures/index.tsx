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
        Learn more about ArchID, your journey begins here
      </>
    ),
    link: '/docs/start',
  },
  {
    title: 'Contract Developers',
    Svg: require('@site/static/img/token.svg').default,
    description: (
      <>
        Register and manage domains from your CosmWasm smart contracts
      </>
    ),
    link: '/docs/contracts/intro',
  },
  {
    title: 'Dapp Developers',
    Svg: require('@site/static/img/token-update.svg').default,
    description: (
      <>
        Execute and query the ArchID Registry from your dapps
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
        <Link to={link} className={clsx('body-link', styles.bodyLink)}>
          <p>{description}</p>
        </Link>
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
